import cloudinary, { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

export function uploads(
  file: string,
  public_id?: string,
  overwrite?: boolean,
  invalidate?: boolean
): Promise<UploadApiErrorResponse | UploadApiResponse | undefined> {
  return new Promise(() => {
    cloudinary.v2.uploader.upload(file, {
      public_id,
      overwrite,
      invalidate
    });
  });
}
