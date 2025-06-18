// src/core/DevPayr.ts

import { Config } from './Config';
import { RuntimeValidator } from './RuntimeValidator';
import { ProjectService } from '../services/ProjectService';
import { LicenseService } from '../services/LicenseService';
import { DomainService } from '../services/DomainService';
import { InjectableService } from '../services/InjectableService';
import { PaymentService } from '../services/PaymentService';
import { DevPayrException } from '../support/Exceptions';
import * as fs from 'fs';
import * as path from 'path';

export class DevPayr {
    private static configInstance: Config;

    /**
     * Bootstraps the SDK (validates license, loads injectables if applicable).
     */
    public static async bootstrap(userConfig: Record<string, any>): Promise<void> {
        this.configInstance = new Config(userConfig);

        try {
            let data: any = null;

            if (this.configInstance.isLicenseMode()) {
                const validator = new RuntimeValidator(this.configInstance);
                data = await validator.validate();
            }

            const onReady = this.configInstance.get('onReady');
            if (typeof onReady === 'function') {
                onReady(data);
            }
        } catch (e: any) {
            this.handleFailure(e.message ?? 'License validation failed', userConfig);
        }
    }

    /**
     * Handle invalid license failure depending on mode.
     */
    private static handleFailure(message: string, config: Record<string, any>): void {
        const mode = config['invalidBehavior'] ?? 'modal';
        const finalMessage = config['customInvalidMessage'] ?? message;

        switch (mode) {
            case 'redirect':
                const target = config['redirectUrl'] ?? 'https://devpayr.com/upgrade';
                if (typeof window !== 'undefined') {
                    window.location.href = target;
                } else {
                    console.error(`[DevPayr] Redirect failed. Use in browser context.`);
                }
                break;

            case 'log':
                console.error(`[DevPayr] License validation failed: ${finalMessage}`);
                break;

            case 'silent':
                break;

            case 'modal':
            default:
                const customPath = config['customInvalidView'];
                const defaultPath = path.resolve(__dirname, '../resources/views/unlicensed.html');
                const htmlPath = customPath ?? defaultPath;

                try {
                    let html = fs.readFileSync(htmlPath, 'utf-8');
                    html = html.replace('{{message}}', finalMessage);

                    if (typeof document !== 'undefined') {
                        const container = document.createElement('div');
                        container.innerHTML = html;
                        document.body.appendChild(container);
                    } else {
                        console.log(html);
                    }
                } catch {
                    console.log(`<h1>⚠️ Unlicensed Software</h1><p>${finalMessage}</p>`);
                }

                break;
        }
    }

    /**
     * Access raw config (advanced use).
     */
    public static config(): Config {
        return this.configInstance;
    }

    // ---------------------------------------------------------------
    // 🔹 Service Accessors
    // ---------------------------------------------------------------

    public static projects(): ProjectService {
        return new ProjectService(this.configInstance);
    }

    public static licenses(): LicenseService {
        return new LicenseService(this.configInstance);
    }

    public static domains(): DomainService {
        return new DomainService(this.configInstance);
    }

    public static injectables(): InjectableService {
        return new InjectableService(this.configInstance);
    }

    public static payments(): PaymentService {
        return new PaymentService(this.configInstance);
    }
}
