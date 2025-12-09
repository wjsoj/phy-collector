import { NextRequest, NextResponse } from 'next/server';
import { uploadMultipleFiles } from '@/lib/minio';
import type { UploadResponse } from '@/types';

/**
 * POST /api/upload
 * Upload files to MinIO object storage
 * Used by Vditor editor for image uploads
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    // Validate files exist
    if (!files || files.length === 0) {
      return NextResponse.json(
        {
          msg: 'No files provided',
          code: 1,
          data: { errFiles: [], succMap: {} },
        } as UploadResponse,
        { status: 400 }
      );
    }

    // Validate file count
    if (files.length > 10) {
      return NextResponse.json(
        {
          msg: 'Maximum 10 files allowed',
          code: 1,
          data: { errFiles: [], succMap: {} },
        } as UploadResponse,
        { status: 400 }
      );
    }

    // Validate file types and sizes
    const errFiles: string[] = [];
    const validFiles: File[] = [];

    for (const file of files) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        errFiles.push(file.name);
        continue;
      }

      // Check file type (images only)
      if (!file.type.startsWith('image/')) {
        errFiles.push(file.name);
        continue;
      }

      validFiles.push(file);
    }

    // Upload valid files
    const { succMap, errFiles: uploadErrFiles } = await uploadMultipleFiles(validFiles);

    // Combine validation and upload errors
    const allErrFiles = [...errFiles, ...uploadErrFiles];

    const response: UploadResponse = {
      msg: allErrFiles.length > 0 ? 'Some files failed to upload' : 'Upload successful',
      code: allErrFiles.length === files.length ? 1 : 0,
      data: {
        succMap,
        errFiles: allErrFiles.length > 0 ? allErrFiles : undefined,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        msg: 'Upload failed',
        code: 1,
        data: { errFiles: [], succMap: {} },
      } as UploadResponse,
      { status: 500 }
    );
  }
}
