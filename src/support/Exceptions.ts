/**
 * Base DevPayr error class – all custom SDK errors should extend this.
 */
export class DevPayrException extends Error {
    public readonly name: string = 'DevPayrException';

    constructor(message: string) {
        super(message);
        Error.captureStackTrace?.(this, this.constructor);
    }
}

/**
 * Thrown when a license check fails or returns an invalid result.
 */
export class LicenseValidationException extends DevPayrException {
    public readonly name: string = 'LicenseValidationException';

    constructor(message: string = 'License validation failed.') {
        super(message);
    }
}

/**
 * Thrown when injectables are invalid, corrupted, or fail verification.
 */
export class InjectableVerificationException extends DevPayrException {
    public readonly name: string = 'InjectableVerificationException';

    constructor(message: string = 'Injectable verification failed.') {
        super(message);
    }
}

/**
 * Thrown when HTTP/API calls fail in a meaningful way (non-network).
 */
export class HttpRequestException extends DevPayrException {
    public readonly name: string = 'HttpRequestException';
    public readonly statusCode?: number;
    public readonly responseBody?: any;

    constructor(message: string, statusCode?: number, responseBody?: any) {
        super(message);
        this.statusCode = statusCode;
        this.responseBody = responseBody;
    }
}

/**
 * Thrown when encryption or decryption fails.
 */
export class CryptoException extends DevPayrException {
    public readonly name: string = 'CryptoException';

    constructor(message: string = 'Cryptographic operation failed.') {
        super(message);
    }
}
