import {
  S3Client,
  PutObjectCommand,
  type PutObjectCommandInput,
} from '@aws-sdk/client-s3';

/**
 * MinIO S3 client configuration
 * This client should ONLY be used on the server-side (API routes)
 * NEVER expose MinIO credentials to the browser
 */
const minioClient = new S3Client({
  region: process.env.MINIO_REGION || 'us-east-1',
  endpoint: process.env.MINIO_ENDPOINT,
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY!,
    secretAccessKey: process.env.MINIO_SECRET_KEY!,
  },
  forcePathStyle: true, // Required for MinIO compatibility
});

/**
 * Uploads a file to MinIO object storage
 * @param file - The file to upload
 * @returns The public URL of the uploaded file
 */
export async function uploadFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(7);
  const key = `uploads/${timestamp}-${randomSuffix}-${file.name}`;

  const params: PutObjectCommandInput = {
    Bucket: process.env.MINIO_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: file.type || 'application/octet-stream',
    ACL: 'public-read',
  };

  await minioClient.send(new PutObjectCommand(params));

  // Construct the public URL
  const publicUrl = `${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET}/${key}`;
  return publicUrl;
}

/**
 * Uploads multiple files to MinIO
 * @param files - Array of files to upload
 * @returns Object with successful uploads and failed files
 */
export async function uploadMultipleFiles(files: File[]): Promise<{
  succMap: Record<string, string>;
  errFiles: string[];
}> {
  const succMap: Record<string, string> = {};
  const errFiles: string[] = [];

  for (const file of files) {
    try {
      const url = await uploadFile(file);
      succMap[file.name] = url;
    } catch (error) {
      console.error(`Failed to upload ${file.name}:`, error);
      errFiles.push(file.name);
    }
  }

  return { succMap, errFiles };
}
