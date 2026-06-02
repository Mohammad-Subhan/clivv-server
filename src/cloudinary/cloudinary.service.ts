import { Injectable } from "@nestjs/common";
import { UploadApiResponse, v2 as cloudinary } from "cloudinary";

@Injectable()
export class CloudinaryService {
  async uploadFile(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'clivv/logos',
          transformation: [
            { width: 256, height: 256, crop: 'fill', gravity: 'center' },
          ],
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error("Upload to Cloudinary failed"));
          resolve(result);
        }
      ).end(file.buffer);

    });
  }

  async deleteFile(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId)
  }
}