// src/utils/HashHelper.ts

import * as crypto from 'crypto';

export class HashHelper {
    /**
     * Generate a SHA-256 hash of a string.
     */
    public static hash(content: string): string {
        return crypto.createHash('sha256').update(content, 'utf-8').digest('hex');
    }

    /**
     * Generate an HMAC-SHA256 signature.
     */
    public static signature(content: string, secret: string): string {
        return crypto.createHmac('sha256', secret).update(content, 'utf-8').digest('hex');
    }

    /**
     * Verify that a content string matches the expected SHA-256 hash.
     */
    public static verifyHash(content: string, expectedHash: string): boolean {
        const hash = this.hash(content);
        return this.safeCompare(hash, expectedHash);
    }

    /**
     * Verify that the HMAC-SHA256 signature of a string matches the expected value.
     */
    public static verifySignature(content: string, secret: string, expectedSignature: string): boolean {
        const actualSignature = this.signature(content, secret);
        return this.safeCompare(actualSignature, expectedSignature);
    }

    /**
     * Safely compare two hashes or signatures in constant time.
     */
    private static safeCompare(a: string, b: string): boolean {
        const bufferA = Buffer.from(a, 'utf-8');
        const bufferB = Buffer.from(b, 'utf-8');

        if (bufferA.length !== bufferB.length) {
            return false;
        }

        return crypto.timingSafeEqual(bufferA, bufferB);
    }
}
