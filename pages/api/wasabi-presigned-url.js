import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

async function handler(req, res) {
  const client = new S3({
    correctClockSkew: true,
    endpoint: process.env.WASABI_ENDPOINT,
    credentials: {
      accessKeyId: process.env.WASABI_KEY,
      secretAccessKey: process.env.WASABI_SECRET,
    },
    region: process.env.WASABI_REGION,
    signatureVersion: 'v4',
  });
  const command = new PutObjectCommand({
    Bucket: process.env.WASABI_BUCKET,
    Key: req.query.file,
  });
  const signedUrl = await getSignedUrl(client, command, {
    expiresIn: 10 * 60,
  });

  res.status(200).json({ url: signedUrl });
}

export default handler;
