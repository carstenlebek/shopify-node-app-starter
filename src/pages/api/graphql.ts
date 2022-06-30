import Shopify from "@lib/shopify";
import { ApiRequest, NextApiResponse } from "@types";

export default async function handler(req: ApiRequest, res: NextApiResponse) {
    try {
        const response = await Shopify.Utils.graphqlProxy(req, res);
        res.status(200).send(response.body);
    } catch (err) {
        console.error(err.message)
        res.status(500).send(err.message);
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
}