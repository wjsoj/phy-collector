import type { UploadResponse } from '../types';

const minioEndpoint = import.meta.env.VITE_MINIO_ENDPOINT;
const minioAccessKey = import.meta.env.VITE_MINIO_ACCESS_KEY;
const minioSecretKey = import.meta.env.VITE_MINIO_SECRET_KEY;
const minioBucket = import.meta.env.VITE_MINIO_BUCKET;

/**
 * Generate a unique filename to avoid conflicts
 */
function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = originalFilename.split('.').pop();
  const nameWithoutExt = originalFilename.replace(/\.[^/.]+$/, '');
  return `${nameWithoutExt}-${timestamp}-${random}.${extension}`;
}

/**
 * Upload files to MinIO using S3-compatible API
 */
export async function uploadToMinio(files: File[]): Promise<UploadResponse> {
  if (!minioEndpoint || !minioAccessKey || !minioSecretKey || !minioBucket) {
    console.warn('MinIO credentials not configured');
    return {
      msg: 'MinIO not configured. Please set VITE_MINIO_* environment variables.',
      code: 1,
      data: {
        errFiles: files.map((f) => f.name),
      },
    };
  }

  const succMap: Record<string, string> = {};
  const errFiles: string[] = [];

  for (const file of files) {
    try {
      const uniqueFilename = generateUniqueFilename(file.name);
      const objectKey = `uploads/${uniqueFilename}`;

      // Use S3-compatible PUT request
      const url = `${minioEndpoint}/${minioBucket}/${objectKey}`;

      const response = await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
          'X-Amz-ACL': 'public-read', // Make the file publicly readable
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Upload failed for ${file.name}:`, response.status, errorText);
        errFiles.push(file.name);
      } else {
        // Construct the public URL for the uploaded file
        const publicUrl = `${minioEndpoint}/${minioBucket}/${objectKey}`;
        succMap[file.name] = publicUrl;
      }
    } catch (error) {
      console.error(`Error uploading ${file.name}:`, error);
      errFiles.push(file.name);
    }
  }

  if (errFiles.length > 0 && Object.keys(succMap).length === 0) {
    return {
      msg: 'All files failed to upload',
      code: 1,
      data: {
        errFiles,
      },
    };
  }

  return {
    msg: errFiles.length > 0 ? 'Some files failed to upload' : 'Upload successful',
    code: 0,
    data: {
      succMap,
      errFiles,
    },
  };
}

export function createVditorUploadHandler() {
  return async (files: File[]): Promise<string> => {
    const response = await uploadToMinio(files);

    if (response.code !== 0) {
      throw new Error(response.msg || 'Upload failed');
    }

    return JSON.stringify(response);
  };
}
