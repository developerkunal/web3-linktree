import { NextApiRequest, NextApiResponse } from "next";
import { SpheronClient, ProtocolEnum } from "@spheron/storage";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const bucketName = "Linkee"; // use whichever name you prefer
    const protocol = ProtocolEnum.IPFS; // use whichever protocol you prefer

    const client = new SpheronClient({
      token: process.env.NEXT_PUBLIC_IPFS_TOKEN || '',
    });

    const { uploadToken } = await client.createSingleUploadToken({
      name: bucketName,
      protocol,
    });

    res.status(200).json({
      uploadToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
}
