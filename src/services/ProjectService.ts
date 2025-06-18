// src/services/ProjectService.ts

import { Config } from '../core/Config';
import { HttpClient } from '../utils/HttpClient';
import { DevPayrException } from '../support/Exceptions';

export class ProjectService {
    private config: Config;
    private http: HttpClient;

    constructor(config: Config) {
        this.config = config;
        this.http = new HttpClient(config);
    }

    /**
     * Create a new project.
     */
    public async create(data: Record<string, any>): Promise<any> {
        return this.http.post('project', data);
    }

    /**
     * Update an existing project.
     */
    public async update(projectId: string | number, data: Record<string, any>): Promise<any> {
        return this.http.put(`project/${projectId}`, data);
    }

    /**
     * Delete a project.
     */
    public async delete(projectId: string | number): Promise<any> {
        return this.http.delete(`project/${projectId}`);
    }

    /**
     * Retrieve a single project by ID.
     */
    public async get(projectId: string | number): Promise<any> {
        return this.http.get(`project/${projectId}`);
    }

    /**
     * List all projects available to the current API key.
     */
    public async list(): Promise<any> {
        return this.http.get('projects');
    }
}
