const webhooks = {
    "APP_UNINSTALLED": {
        path: '/api/webhooks',
        webhookHandler: async (topic, shop, body) => {
            console.log("App uninstalled")
        }
    }
}

export default webhooks