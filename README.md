# 🚀🚀 Typesafe serverless Next.js Shopify app template

This is an opinionated starter template for embedded Shopify apps. The biggest opinion is, that Typescript should be used everywhere and it's the only right opinion.

This Template utilizes Middleware and Next.js APIs for OAuth, so no custom server is needed.

Found a bug? Please create an issue! ❤️

## Table of Contents

- 🤩 Features
- 👀 Requirements
- 🤓 Getting Started
- 🎣 Fetching Data
- 🧰 Built with

## 🤩 Features

- ⚡ Next.js - React Framework for static rendering
- ✨ Serverless Architecture
- 💳 App Subscriptions
- 💾 Session Storage with Redis
- 🚇 Ngrok for development
- 🪝 Webhooks set up

### 🦺 Typesafety

- [GraphQl Code Generator](https://www.graphql-code-generator.com) for the Shopify Admin API
- [tRPC](https://trpc.io) for end-to-end typesafe APIs

## 👀 Requirements

- Shopify Partner Account
- Shopify Dev Store
- Ngrok account
- Upstash Redis Database

## 🤓 Getting Started

- Click `Use this template` or [this link](https://github.com/carstenlebek/next-shopify-app/generate)
- Create an App in your Shopify Partner Account
  - Set https://localhost as the App Url for now
- Fill out your `.env` file
  - `SHOPIFY_API_KEY`: The Shopify Api key of the app, you have just created
  - `SHOPIFY_API_SECRET_KEY`: The Shopify Api secret key of the app, you have just created
  - `SCOPES`: The [access scopes](https://shopify.dev/api/usage/access-scopes) your app needs
  - `SHOP`: Your dev stores url
  - `NGROK_AUTH_TOKEN`: Your [Ngrok auth token](https://dashboard.ngrok.com/get-started/your-authtoken)
  - `UPSTASH_REDIS_REST_URL`: Your Upstash Redis REST url.
  - `UPSTASH_REDIS_REST_TOKEN`: Your Upstash Redis REST token.
- Run `npm install`
- Run `npm run dev`
- Your apps ngrok url will be printed to the terminal
- Install the app to your dev store
- After you have completed auth, you can run `npm run get-schema` to generate the gql schema for the admin API, if you want to use a different version than `2022-07z`
- Run `npm run generate` in a seperate terminal to start the GraphQL code generator

## 🎣 Fetching Data

### Shopify Admin API

1. Start the GraphQL code generator with `npm run generate`
2. Create your Query/Mutation (examples in `src/graphql`)
3. Use the generated react-query hook to get your data (example in `src/pages/get-data.tsx` and `src/pages/subscriptions.tsx`)

### tRPC

1. Read the [tRPC docs](https://trpc.io/docs)
2. Hook up your DB ([Prisma](https://www.prisma.io) is a great addition to tRPC)
3. Define your tRPC router
4. Use the `trpc.useQuery()` hook to access your data

## 🧰 Built with

- [TypeScript](https://www.typescriptlang.org)
- [Next.js](https://nextjs.org/)
- [@shopify/shopify-api](https://github.com/Shopify/shopify-node-api)
- [tRPC](https://trpc.io)
- [React Query](https://react-query.tanstack.com)
- [GraphQL Code Generator](https://www.graphql-code-generator.com)
