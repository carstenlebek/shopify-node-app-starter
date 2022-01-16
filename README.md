# Shopify Node App Starter

This is a starter template for embedded shopify apps based on the [shopify cli node app](https://github.com/Shopify/shopify-app-node).

## Changes to the default Shopify node app starter

- Updated dependencies (@apollo/client instead of react-apollo, react 17, next.js 12, polaris 7)
- MongoDB session storage already set up (full credit goes to [Harshdeep Singh Hura](https://github.com/kinngh/shopify-node-mongodb-next-app))
- App context set up. Can be used to store data, that only needs to be fetched once, but is needed in multiple places
- Routepropagation set up

Boilerplate to create an embedded Shopify app made with Node, [Next.js](https://nextjs.org/), [Shopify-koa-auth](https://github.com/Shopify/quilt/tree/master/packages/koa-shopify-auth), [Polaris](https://github.com/Shopify/polaris-react) and [App Bridge React](https://shopify.dev/tools/app-bridge/react-components).

## Installation

Fork and clone repo

## Requirements

- If you don’t have one, [create a Shopify partner account](https://partners.shopify.com/signup).
- If you don’t have one, [create a Development store](https://help.shopify.com/en/partners/dashboard/development-stores#create-a-development-store) where you can install and test your app.
- In the Partner dashboard, [create a new app](https://help.shopify.com/en/api/tools/partner-dashboard/your-apps#create-a-new-app). You’ll need this app’s API credentials during the setup process.

## Usage

Same usage as apps created with the [Shopify CLI](https://github.com/Shopify/shopify-cli)

## License

This respository is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
