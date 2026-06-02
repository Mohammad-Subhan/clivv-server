import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { SecretService } from './secret.service';
import { CreateSecretDto } from './dto/createSecret.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/auth/user.decorator';
import { UpdateSecretDto } from './dto/updateSecret.dto';

@Controller('secret')
export class SecretController {
  constructor(private readonly secretService: SecretService) { }

  @UseGuards(AuthGuard)
  @Post("create")
  @UseInterceptors(FileInterceptor('logo'))
  async createSecret(
    @User() userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() createSecretDto: CreateSecretDto
  ) {
    return this.secretService.createSecret(userId, file, createSecretDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAllSecrets(@User() userId: string) {
    return this.secretService.getAllSecrets(userId);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteSecret(@Param('id') id: string, @User() userId: string) {
    return this.secretService.deleteSecret(id, userId);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('logo'))
  async updateSecret(
    @Param('id') id: string,
    @User() userId: string,
    @Body() updateSecretDto: UpdateSecretDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.secretService.updateSecret(id, userId, updateSecretDto, file);
  }
}
