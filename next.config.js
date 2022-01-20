const { parsed: localEnv } = require("dotenv").config();

const webpack = require("webpack");
const apiKey = JSON.stringify(process.env.SHOPIFY_API_KEY);
const envHost = JSON.stringify(process.env.HOST);
const host = process.env.HOST;

module.exports = {
      async headers() {
      return [
        {
          source: "/(.*?)",
          headers: [
            {
              key: "Content-Security-Policy",
              value: "frame-ancestors 'self' https://*.myshopify.com",
            },
          ],
        },
        {
          source: "/(.*?)",
          has: [
            {
              type: "query",
              key: "shop",
            },
          ],
          headers: [
            {
              key: "Content-Security-Policy",
              value: "frame-ancestors 'self' https://admin.shopify.com https://:shop;",
            },
          ],
        },
      ];
    },
  webpack: (config) => {
    const env = { API_KEY: apiKey, HOST: envHost };
    config.plugins.push(new webpack.DefinePlugin(env));

    // Add ESM support for .mjs files in webpack 4
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    });

    return config;
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${host}/api/:path*`,
      },
    ];
  },
};
