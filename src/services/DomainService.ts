// src/services/DomainService.ts

import { Config } from '../core/Config';
import { HttpClient } from '../utils/HttpClient';
import { DevPayrException } from '../support/Exceptions';

export class DomainService {
    private config: Config;
    private http: HttpClient;

    constructor(config: Config) {
        this.config = config;
        this.http = new HttpClient(config);
    }

    /**
     * List all domains under a project.
     */
    public async list(projectId: string | number): Promise<any> {
        return this.http.get(`project/${projectId}/domains`);
    }

    /**
     * Create a domain under a project.
     */
    public async create(projectId: string | number, data: Record<string, any>): Promise<any> {
        return this.http.post(`project/${projectId}/domains`, data);
    }

    /**
     * Show a specific domain entry.
     */
    public async show(projectId: string | number, domainId: string | number): Promise<any> {
        return this.http.get(`project/${projectId}/domain/${domainId}`);
    }

    /**
     * Update a domain for a project.
     */
    public async update(
        projectId: string | number,
        domainId: string | number,
        data: Record<string, any>
    ): Promise<any> {
        return this.http.put(`project/${projectId}/domain/${domainId}`, data);
    }

    /**
     * Delete a domain entry from a project.
     */
    public async delete(projectId: string | number, domainId: string | number): Promise<any> {
        return this.http.delete(`project/${projectId}/domains/${domainId}`);
    }
}
