import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Client } from "./s3";

const bucketName = process.env.S3_BUCKET_NAME;

if (!bucketName) {
  throw new Error("Bucket not defined");
}

export async function getImageUrl(key: string, expiresIn: number) {
  const getCommand = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  const signedUrl = await getSignedUrl(getS3Client(), getCommand, {
    expiresIn: expiresIn,
  });

  return signedUrl;
}
