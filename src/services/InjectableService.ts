// src/services/InjectableService.ts

import { Config } from '../core/Config';
import { HttpClient } from '../utils/HttpClient';
import { DevPayrException } from '../support/Exceptions';

export class InjectableService {
    private config: Config;
    private http: HttpClient;

    constructor(config: Config) {
        this.config = config;
        this.http = new HttpClient(config);
    }

    /**
     * List all injectables under a project.
     */
    public async list(projectId: string | number): Promise<any> {
        return this.http.get(`project/${projectId}/injectables`);
    }

    /**
     * Create a new injectable.
     */
    public async create(projectId: string | number, data: Record<string, any>): Promise<any> {
        return this.http.post(`project/${projectId}/injectables`, data);
    }

    /**
     * Retrieve a specific injectable.
     */
    public async show(projectId: string | number, injectableId: string | number): Promise<any> {
        return this.http.get(`project/${projectId}/injectables/${injectableId}`);
    }

    /**
     * Update an existing injectable.
     */
    public async update(
        projectId: string | number,
        injectableId: string | number,
        data: Record<string, any>
    ): Promise<any> {
        return this.http.put(`project/${projectId}/injectables/${injectableId}`, data);
    }

    /**
     * Delete an injectable from the project.
     */
    public async delete(projectId: string | number, injectableId: string | number): Promise<any> {
        return this.http.delete(`project/${projectId}/injectables/${injectableId}`);
    }

    /**
     * Stream all injectables using license-protected SDK endpoint.
     */
    public async stream(): Promise<any> {
        return this.http.get('injectable/stream');
    }
}
