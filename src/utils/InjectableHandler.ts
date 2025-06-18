// src/utils/InjectableHandler.ts

import { InjectableProcessor } from '../contracts/InjectableProcessor';
import { InjectablePayload } from '../contracts/InjectableProcessor';
import { CryptoHelper } from './CryptoHelper';
import { HashHelper } from './HashHelper';
import {CryptoException, DevPayrException, InjectableVerificationException} from '../support/Exceptions';
import * as fs from 'fs';
import * as path from 'path';

export class InjectableHandler {
    private static customProcessor: InjectableProcessor | null = null;

    /**
     * Set a custom processor instance that implements the InjectableProcessor interface.
     */
    public static setProcessor(processor: InjectableProcessor): void {
        if (typeof processor.handle !== 'function') {
            throw new InjectableVerificationException('Custom processor must implement InjectableProcessor interface.');
        }

        this.customProcessor = processor;
    }

    /**
     * Process a batch of injectables with optional signature verification.
     */
    public static process(
        injectables: InjectablePayload[],
        options: {
            secret: string;
            path?: string;
            verify?: boolean;
        }
    ): void {
        const secret = options.secret;
        const basePath = options.path ?? require('os').tmpdir();
        const verify = options.verify ?? true;

        if (!secret) {
            throw new CryptoException('Injectable handler requires a secret key.');
        }

        for (const injectable of injectables) {
            const slug = injectable.name;
            const targetPath = injectable.path;
            const encrypted = injectable.content;
            const signature = injectable.signature;

            if (!slug || !encrypted || !targetPath) {
                throw new CryptoException('Injectable must include name, content, and path.');
            }

            if (verify && signature && !HashHelper.verifySignature(encrypted, secret, signature)) {
                throw new InjectableVerificationException(`Signature verification failed for injectable: ${slug}`);
            }

            if (this.customProcessor) {
                this.customProcessor.handle(injectable, secret, basePath, verify);
            } else {
                this.handle(injectable, secret, basePath);
            }
        }
    }

    /**
     * Default handler — supports append, prepend, replace.
     */
    public static handle(
        injectable: InjectablePayload,
        secret: string,
        basePath: string
    ): string {
        const slug = injectable.name;
        const targetPath = injectable.path;
        const mode = injectable.mode ?? 'replace';
        const encrypted = injectable.content;
        const decrypted = CryptoHelper.decrypt(encrypted, secret);

        if (!targetPath) {
            throw new DevPayrException(`No target path specified for injectable: ${slug}`);
        }

        const fullPath = path.join(basePath, targetPath);
        const dir = path.dirname(fullPath);

        if (!fs.existsSync(dir)) {
            try {
                fs.mkdirSync(dir, { recursive: true });
            } catch (e) {
                throw new DevPayrException(`Unable to create directory: ${dir}`);
            }
        }

        let contentToWrite = decrypted;

        if (fs.existsSync(fullPath)) {
            const existing = fs.readFileSync(fullPath, 'utf-8');

            contentToWrite = mode === 'append'
                ? existing + decrypted
                : mode === 'prepend'
                    ? decrypted + existing
                    : decrypted;
        }

        try {
            fs.writeFileSync(fullPath, contentToWrite);
        } catch (e) {
            throw new InjectableVerificationException(`Failed to write injectable to: ${fullPath}`);
        }

        return fullPath;
    }
}
