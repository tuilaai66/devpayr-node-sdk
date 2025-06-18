// src/contracts/InjectableProcessor.ts

/**
 * Represents a single injectable received from the DevPayr API.
 */
export interface InjectablePayload {
    name: string;
    mode: 'append' | 'prepend' | 'replace';
    content: string;
    signature: string;
    path?: string; // Optional: file path or location hint
    [key: string]: any; // Allow other dynamic metadata
}

/**
 * Contract for a custom injectable processor.
 * Used when `handleInjectables` is true and `injectablesProcessor` is provided.
 */
export interface InjectableProcessor {
    /**
     * Handle an injectable payload: decrypt, verify, and process.
     *
     * @param injectable  The raw injectable payload from the API
     * @param secret      Shared secret for decryption/HMAC verification
     * @param basePath    Path to write file to (or use as root for relative paths)
     * @param verifySignature Whether to HMAC-verify the signature
     *
     * @returns           A path or identifier of the processed injectable (can be ignored if not file-based)
     */
    handle(
        injectable: InjectablePayload,
        secret: string,
        basePath: string,
        verifySignature?: boolean
    ): Promise<string> | string;
}
