import "@babel/polyfill";
import "isomorphic-fetch";

import Shopify, { ApiVersion } from "@shopify/shopify-api";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";

import Cryptr from "cryptr";
import Koa from "koa";
import Router from "koa-router";
import dotenv from "dotenv";
import mongoose from "mongoose";
import next from "next";
import { webhooks } from "../webhooks/index.js";

const sessionStorage = require("./../utils/sessionStorage.js");
const SessionModel = require("./../models/SessionModel.js");
const ShopModel = require("./../models/ShopModel.js");

const cryption = new Cryptr(process.env.ENCRYPTION_STRING);

// MongoDB Connection
const mongoUrl =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/shopify-app";

mongoose.connect(
  mongoUrl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log("--> There was an error connecting to MongoDB:", err.message);
    } else {
      console.log("--> Connected to MongoDB");
    }
  }
);

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\/|\/$/g, ""),
  API_VERSION: "2022-01",
  IS_EMBEDDED_APP: true,
  SESSION_STORAGE: sessionStorage,
});

// Reload webhooks after server restart

for (const webhook of webhooks) {
  Shopify.Webhooks.Registry.webhookRegistry.push({
    path: webhook.path,
    topic: webhook.topic,
    webhookHandler: webhook.webhookHandler,
  });
}

app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();
  server.keys = [Shopify.Context.API_SECRET_KEY];

  let useOfflineAccessToken = false;

  // Uncomment to use offline and online access tokens

  // useOfflineAccessToken = true;

  // server.use(
  //   createShopifyAuth({
  //     accessMode: "offline",
  //     prefix: "/install",
  //     async afterAuth(ctx) {
  //       const { shop, accessToken, scope } = ctx.state.shopify;
  //       const host = ctx.query.host;

  //       const result = await ShopModel.findOne({ shop: shop });

  //       if (!result) {
  //         await ShopModel.create({
  //           shop: shop,
  //           accessToken: cryption.encrypt(accessToken),
  //           scope: scope,
  //         }).then(() => ctx.redirect(`/auth?shop=${shop}&host=${host}`));
  //       } else {
  //         ctx.redirect(`/auth?shop=${shop}&host=${host}`);
  //       }
  //     },
  //   })
  // );

  server.use(
    createShopifyAuth({
      async afterAuth(ctx) {
        // Access token and shop available in ctx.state.shopify
        const { shop, accessToken, scope } = ctx.state.shopify;
        const host = ctx.query.host;
        // ACTIVE_SHOPIFY_SHOPS[shop] = scope;

        for (const webhook of webhooks) {
          const response = await Shopify.Webhooks.Registry.register({
            shop,
            accessToken,
            path: webhook.path,
            topic: webhook.topic,
            webhookHandler: webhook.webhookHandler,
          });

          if (!response.success) {
            console.log(
              `Failed to register ${webhook.topic} webhook: ${response.result}`
            );
          } else {
            console.log(`Successfully registered ${webhook.topic} webhook.`);
          }
        }

        // Redirect to app with shop parameter upon auth
        ctx.redirect(`/?shop=${shop}&host=${host}`);
      },
    })
  );

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  router.post("/webhooks", async (ctx) => {
    try {
      await Shopify.Webhooks.Registry.process(ctx.req, ctx.res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
    }
  });

  router.post(
    "/graphql",
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      await Shopify.Utils.graphqlProxy(ctx.req, ctx.res);
    }
  );

  // API routes HAVE to start with '/api/'

  router.get("/api/example", verifyRequest(), async (ctx, next) => {
    const {
      id,
      shop,
      state,
      isOnline,
      accessToken,
      scope,
    } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);

    ctx.body = JSON.stringify({
      id: id,
      shop: shop,
      state: state,
      isOnline: isOnline,
      accessToken: accessToken,
      scope: scope,
    });
    ctx.status = 200;
  });

  router.get("(/_next/static/.*)", handleRequest); // Static content is clear
  router.get("/_next/webpack-hmr", handleRequest); // Webpack content is clear
  router.get("/installation", handleRequest);
  router.get("(.*)", async (ctx) => {
    const shop = ctx.query.shop;

    // if (!shop) {
    //   console.log("SHOP IS UNDEFINED");
    //   ctx.redirect("/installation");
    //   return;
    // }

    if (useOfflineAccessToken) {
      const isInstalled = await ShopModel.countDocuments({ shop });

      if (isInstalled === 0) {
        ctx.redirect(`/install/auth?shop=${shop}`);
      } else {
        const findShopCount = await SessionModel.countDocuments({ shop });

        if (findShopCount < 2) {
          await SessionModel.deleteMany({ shop });
          ctx.redirect(`/auth?shop=${shop}`);
        } else {
          await handleRequest(ctx);
        }
      }
    } else {
      const findShopCount = await SessionModel.countDocuments({ shop });

      if (findShopCount < 2) {
        await SessionModel.deleteMany({ shop });
        ctx.redirect(`/auth?shop=${shop}`);
      } else {
        await handleRequest(ctx);
      }
    }
  });

  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
