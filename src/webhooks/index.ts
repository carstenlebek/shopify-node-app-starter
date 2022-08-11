const webhooks = {
    "APP_UNINSTALLED": {
        path: '/api/webhooks',
        webhookHandler: async (topic: string, shop: string, body: any) => {
            console.log('App uninstalled');
        },
    },
    "CUSTOMERS_DATA_REQUEST": {
        path: '/api/webhooks',
        webhookHandler: async (topic: string, shop: string, body: any) => {
            console.log('Customer data request');
        }
    },
    "CUSTOMERS_REDACT": {
        path: '/api/webhooks',
        webhookHandler: async (topic: string, shop: string, body: any) => {
            console.log('Customer data redacted');
        }
    },
    "SHOP_REDACT": {
        path: '/api/webhooks',
        webhookHandler: async (topic: string, shop: string, body: any) => {
            console.log('Shop data redacted');
        }
    }
};

export default webhooks;
