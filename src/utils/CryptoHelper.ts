// src/utils/CryptoHelper.ts

import * as crypto from 'crypto';
import {CryptoException} from '../support/Exceptions';

export class CryptoHelper {
    /**
     * Decrypt a base64-encoded `iv::cipherText` string using AES-256-CBC.
     */
    public static decrypt(encrypted: string, key: string): string {
        let decoded: string;

        try {
            decoded = Buffer.from(encrypted, 'base64').toString('utf-8');
        } catch (e) {
            throw new CryptoException('Failed to base64-decode encrypted string.');
        }

        const parts = decoded.split('::');
        const iv = parts[0];
        const cipherText = parts[1];

        if (!iv || !cipherText) {
            throw new CryptoException("Invalid encrypted format — expected 'iv::cipherText'.");
        }

        const normalizedKey = crypto.createHash('sha256').update(key).digest();

        let decrypted: string;
        try {
            const decipher = crypto.createDecipheriv('aes-256-cbc', normalizedKey, Buffer.from(iv, 'utf-8'));
            decrypted = decipher.update(cipherText, 'utf-8', 'utf-8') + decipher.final('utf-8');
        } catch (e) {
            throw new CryptoException('Decryption failed. Possibly incorrect key or corrupt data.');
        }

        return decrypted;
    }

    /**
     * Encrypt a plaintext string into base64(iv::cipherText) format.
     */
    public static encrypt(plaintext: string, key: string): string {
        const cipherAlgo = 'aes-256-cbc';
        const ivLength = 16;

        let iv: Buffer;
        try {
            iv = crypto.randomBytes(ivLength);
        } catch (e: any) {
            throw new CryptoException(`IV generation failed: ${e.message}`);
        }

        const normalizedKey = crypto.createHash('sha256').update(key).digest();

        let encrypted: string;
        try {
            const cipher = crypto.createCipheriv(cipherAlgo, normalizedKey, iv);
            encrypted = cipher.update(plaintext, 'utf-8', 'utf-8') + cipher.final('utf-8');
        } catch (e) {
            throw new CryptoException('Encryption failed.');
        }

        return Buffer.from(iv.toString('utf-8') + '::' + encrypted, 'utf-8').toString('base64');
    }
}
