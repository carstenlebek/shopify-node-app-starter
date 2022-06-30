// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ApiRequest, NextApiResponse } from "@types";

export default function handler(req: ApiRequest, res: NextApiResponse) {
  res.status(200).json("Hello There!")
}
