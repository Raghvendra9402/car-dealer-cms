import { CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getS3Client } from "./s3";

type MoveImages = {
  listingId: string;
  keys: string[];
};

const bucketName = process.env.S3_BUCKET_NAME;

if (!bucketName) {
  throw new Error("BUCKET_NAME env variable is missing");
}

export async function moveImages({ listingId, keys }: MoveImages) {
  const finalKeys: string[] = [];

  for (const tempKey of keys) {
    const fileName = tempKey.split("/").pop()!;
    if (!fileName) continue;
    const finalKey = `listings/${listingId}/${fileName}`;

    await getS3Client().send(
      new CopyObjectCommand({
        Bucket: bucketName,
        CopySource: encodeURIComponent(`${bucketName}/${tempKey}`),
        Key: finalKey,
      }),
    );

    await getS3Client().send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: tempKey,
      }),
    );

    finalKeys.push(finalKey);
  }

  return finalKeys;
}
