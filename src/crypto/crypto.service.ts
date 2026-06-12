import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

@Injectable()
export class CryptoService {
    private readonly ALGORITHM = "aes-256-gcm";
    private readonly KEY_LENGTH = 32;
    private readonly SALT_LENGTH = 16;
    private readonly IV_LENGTH = 12;
    private readonly AUTH_TAG_LENGTH = 16;

    deriveKey(masterPassword: string, salt: Buffer): Buffer {
        try {
            return scryptSync(
                masterPassword,
                salt,
                this.KEY_LENGTH,
                {
                    N: 16384,
                    r: 8,
                    p: 1
                }
            )
        } catch (error) {
            throw new InternalServerErrorException("Failed to derive encryption key")
        }
    }

    generateIV(): Buffer {
        return randomBytes(this.IV_LENGTH);
    }

    encrypt(plainText: string, key: Buffer, iv: Buffer): { encryptedPassword: string; authTag: string; } {
        try {
            const cipher = createCipheriv(this.ALGORITHM, key, iv);

            const encryptedText = Buffer.concat([
                cipher.update(plainText, "utf-8"),
                cipher.final(),
            ]);

            return {
                encryptedPassword: encryptedText.toString("hex"),
                authTag: cipher.getAuthTag().toString("hex")
            }
        } catch (error) {
            throw new InternalServerErrorException('Encryption failed');
        }
    }

    decrypt(encryptedText: string, iv: string, authTag: string, key: Buffer): string {
        try {
            const decipher = createDecipheriv(this.ALGORITHM, key, Buffer.from(iv, "hex"));

            decipher.setAuthTag(Buffer.from(authTag, "hex"));

            const decryptedText = Buffer.concat([
                decipher.update(Buffer.from(encryptedText, "hex")),
                decipher.final(),
            ]);

            return decryptedText.toString("utf-8");
        } catch (error) {

            if (error?.message?.includes("Unsupported state or unable to authenticate data")) {
                throw new BadRequestException("Invalid master password");
            }
            throw new InternalServerErrorException("Something went wrong");

        }
    }

    encryptPassword(plainText: string, masterPassword: string, secretSalt: string): { encryptedPassword: string, iv: string, authTag: string } {
        const key = this.deriveKey(masterPassword, Buffer.from(secretSalt, 'hex'));
        const iv = this.generateIV();
        const { encryptedPassword, authTag } = this.encrypt(plainText, key, iv);

        return {
            encryptedPassword,
            iv: iv.toString('hex'),
            authTag,
        };
    }

    decryptPassword(
        encryptedText: string,
        iv: string,
        authTag: string,
        masterPassword: string,
        secretSalt: string,
    ): string {
        const key = this.deriveKey(masterPassword, Buffer.from(secretSalt, 'hex'));
        return this.decrypt(encryptedText, iv, authTag, key);
    }
}