import { S3Client } from "@aws-sdk/client-s3";

export function getS3Client() {
  const bucketRegion = process.env.AWS_REGION;
  const accessKey = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

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

export const bucketName = process.env.S3_BUCKET_NAME;
