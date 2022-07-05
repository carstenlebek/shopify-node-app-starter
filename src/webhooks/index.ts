const webhooks = {
	APP_UNINSTALLED: {
		path: '/api/webhooks',
		webhookHandler: async (topic: string, shop: string, body: any) => {
			console.log('App uninstalled');
		},
	},
};

export default webhooks;
