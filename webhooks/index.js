import SessionModel from "../models/SessionModel";

export const webhooks = [
  {
    path: "/webhooks",
    topic: "APP_UNINSTALLED",
    webhookHandler: async (topic, shop, body) => {
      await SessionModel.deleteMany({ shop });
      console.log("APP UNINSTALLED");
    },
  },
];
