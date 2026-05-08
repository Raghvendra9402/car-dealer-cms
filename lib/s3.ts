import { S3Client } from "@aws-sdk/client-s3";

export function getS3Client() {
  const bucketRegion = process.env.BUCKET_REGION;
  const accessKey = process.env.ACCESS_KEY;
  const secretAccessKey = process.env.SECRET_ACCESS_KEY;

  if (!bucketRegion || !accessKey || !secretAccessKey) {
    throw new Error("Missing required AWS environment variables");
  }

  return new S3Client({
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretAccessKey,
    },
    region: bucketRegion,
  });
}

export const bucketName = process.env.BUCKET_NAME;
