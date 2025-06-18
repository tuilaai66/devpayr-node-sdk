// src/core/RuntimeValidator.ts

import { Config } from './Config';
import { DevPayrException } from '../support/Exceptions';
import { InjectableHandler } from '../utils/InjectableHandler';
import { PaymentService } from '../services/PaymentService';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

export class RuntimeValidator {
    private config: Config;
    private license: string;
    private cacheKey: string;

    constructor(config: Config) {
        this.config = config;
        this.license = this.config.get<string>('license');

        if (!this.license) {
            throw new DevPayrException('License key is required for runtime validation.');
        }

        this.cacheKey = 'devpayr_' + this.hash(this.license);
    }

    /**
     * Perform license validation and optionally auto-process injectables.
     */
    public async validate(): Promise<any> {
        if (!this.config.get('recheck') && this.isCached()) {
            return {
                cached: true,
                message: 'License validated from cache',
            };
        }

        const response = await new PaymentService(this.config).checkWithLicenseKey();

        if (!(response?.data?.has_paid ?? false)) {
            throw new DevPayrException('Project is unpaid or unauthorized.');
        }

        this.cacheSuccess();

        // Register custom processor
        const processor = this.config.get('injectablesProcessor');
        if (processor) {
            InjectableHandler.setProcessor(processor);
        }

        // Auto-process injectables if allowed
        if (
            this.config.get('injectables') &&
            this.config.get('handleInjectables', true) &&
            response?.data?.injectables?.length > 0
        ) {
            this.handleInjectables(response.data.injectables);
        }

        return response;
    }

    /**
     * Handle injectable processing via handler utility.
     */
    private handleInjectables(injectables: any[]): void {
        InjectableHandler.process(injectables, {
            secret: this.config.get<string>('secret'),
            path: this.config.get<string>('injectablesPath', os.tmpdir()),
            verify: this.config.get<boolean>('injectablesVerify', true),
        });
    }

    /**
     * Write cache file with today's date.
     */
    private cacheSuccess(): void {
        const file = path.join(os.tmpdir(), this.cacheKey);
        fs.writeFileSync(file, new Date().toISOString().slice(0, 10));
    }

    /**
     * Check if cache file exists and is still valid for today.
     */
    private isCached(): boolean {
        const file = path.join(os.tmpdir(), this.cacheKey);

        if (!fs.existsSync(file)) return false;

        const content = fs.readFileSync(file, 'utf-8').trim();
        return content === new Date().toISOString().slice(0, 10);
    }

    /**
     * Create SHA-256 hash string.
     */
    private hash(input: string): string {
        return require('crypto').createHash('sha256').update(input).digest('hex');
    }
}
