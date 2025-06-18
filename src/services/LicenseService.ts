// src/services/LicenseService.ts

import { Config } from '../core/Config';
import { HttpClient } from '../utils/HttpClient';
import { DevPayrException } from '../support/Exceptions';

export class LicenseService {
    private config: Config;
    private http: HttpClient;

    constructor(config: Config) {
        this.config = config;
        this.http = new HttpClient(config);
    }

    /**
     * List all licenses under a project.
     */
    public async list(projectId: string | number): Promise<any> {
        return this.http.get(`project/${projectId}/licenses`);
    }

    /**
     * Show a specific license record.
     */
    public async show(projectId: string | number, licenseId: string | number): Promise<any> {
        return this.http.get(`project/${projectId}/licenses/${licenseId}`);
    }

    /**
     * Create a new license under a project.
     */
    public async create(projectId: string | number, data: Record<string, any>): Promise<any> {
        return this.http.post(`project/${projectId}/licenses`, data);
    }

    /**
     * Revoke an existing license.
     */
    public async revoke(projectId: string | number, licenseId: string | number): Promise<any> {
        return this.http.post(`project/${projectId}/licenses/${licenseId}/revoke`);
    }

    /**
     * Reactivate a revoked license.
     */
    public async reactivate(projectId: string | number, licenseId: string | number): Promise<any> {
        return this.http.post(`project/${projectId}/licenses/${licenseId}/reactivate`);
    }

    /**
     * Delete a license from the project.
     */
    public async delete(projectId: string | number, licenseId: string | number): Promise<any> {
        return this.http.delete(`project/${projectId}/licenses/${licenseId}`);
    }
}
