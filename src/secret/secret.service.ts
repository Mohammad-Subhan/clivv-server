import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSecretDto } from './dto/createSecret.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UploadApiResponse } from 'cloudinary';
import { InjectModel } from '@nestjs/mongoose';
import { Secret, SecretDocument } from './schemas/secret.schema';
import { Model, Types } from 'mongoose';
import { UpdateSecretDto } from './dto/updateSecret.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SecretService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly userService: UserService,
    @InjectModel(Secret.name) private readonly secretModel: Model<SecretDocument>
  ) { }

  getPublicIdFromUrl(url: string | null) {
    if (!url) return null;
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
    return match ? match[1] : null;
  }

  async createSecret(userId: string, file: Express.Multer.File, createSecretDto: CreateSecretDto) {
    try {
      const { name, website, username, encryptedPassword, iv, authTag } = createSecretDto;

      const exists = await this.secretModel.findOne({ name, website, user: new Types.ObjectId(userId) });
      if (exists) {
        throw new ConflictException("A secret with this name and website already exists");
      }

      const user = await this.userService.findOne({ _id: new Types.ObjectId(userId) });
      if (!user) {
        throw new NotFoundException("User not found");
      }

      let uploadedFile: UploadApiResponse | null = null;
      if (file) {
        uploadedFile = await this.cloudinaryService.uploadFile(file);
      }

      await this.secretModel.create({
        user: new Types.ObjectId(userId),
        name,
        website,
        username,
        encryptedPassword,
        iv,
        authTag,
        logo: uploadedFile?.secure_url || ""
      });

      return {
        message: "Secret created successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllSecrets(userId: string) {
    try {
      const secrets = await this.secretModel
        .find({ user: new Types.ObjectId(userId) })
        .sort({ createdAt: -1 })
        .select("-__v -user");
      return secrets;
    } catch (error) {
      throw error;
    }
  }

  async deleteSecret(id: string, userId: string) {
    try {
      const secret = await this.secretModel.findOne({ _id: new Types.ObjectId(id), user: new Types.ObjectId(userId) });
      if (secret && secret.logo) {
        const publicId = this.getPublicIdFromUrl(secret.logo);
        if (publicId) {
          await this.cloudinaryService.deleteFile(publicId);
        }
      }

      const deletedSecret = await this.secretModel.findOneAndDelete({ _id: new Types.ObjectId(id), user: new Types.ObjectId(userId) });
      if (!deletedSecret) {
        throw new NotFoundException("Secret not found");
      }
      return {
        message: "Secret deleted successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  async updateSecret(id: string, userId: string, updateSecretDto: UpdateSecretDto, file: Express.Multer.File) {
    try {
      const { name, website, username, encryptedPassword, iv, authTag } = updateSecretDto ?? {}

      const exists = await this.secretModel.findOne({
        _id: new Types.ObjectId(id),
        user: new Types.ObjectId(userId)
      });
      if (!exists) {
        throw new NotFoundException("Secret not found");
      }

      const existsWithName = await this.secretModel.findOne({
        name: name,
        website: website,
        user: new Types.ObjectId(userId),
        _id: { $ne: new Types.ObjectId(id) }
      });
      if (existsWithName) {
        throw new ConflictException("A secret with this name and website already exists");
      }

      let uploadedFile: UploadApiResponse | null = null;
      if (file) {
        uploadedFile = await this.cloudinaryService.uploadFile(file);
      }

      const updatedSecret = await this.secretModel.findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
          user: new Types.ObjectId(userId)
        },
        {
          name: name ?? exists.name,
          website: website ?? exists.website,
          username: username ?? exists.username,
          encryptedPassword: encryptedPassword ?? exists.encryptedPassword,
          iv: iv ?? exists.iv,
          authTag: authTag ?? exists.authTag,
          logo: uploadedFile?.secure_url ?? exists.logo
        },
        { new: true }
      );
      if (!updatedSecret) {
        throw new NotFoundException("Secret not found");
      }

      if (uploadedFile && exists.logo) {
        const publicId = this.getPublicIdFromUrl(exists.logo);
        if (publicId) {
          this.cloudinaryService.deleteFile(publicId).catch((err) => {
            console.error("Failed to delete old logo from Cloudinary:", err);
          });
        }
      }

      return {
        message: "Secret updated successfully",
      };
    } catch (error) {
      throw error;
    }
  }
}
