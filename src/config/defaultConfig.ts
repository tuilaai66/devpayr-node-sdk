/**
 * Default and required configuration values for the DevPayr Node SDK.
 * These are merged with user-supplied values by the Config.ts class.
 */

export const requiredConfig = {
    base_url: 'https://api.devpayr.dev/api/v1/', // Required: Base API endpoint
    secret: null, // Required: AES secret used for decrypting injectables
};

export const defaultConfig = {
    // License & Validation
    recheck: true,                       // Use cached validation or revalidate on each request
    license: null,                       // License key (used for runtime validation)
    api_key: null,                       // Optional: For authenticated API calls (project creation, etc.)

    // Behavior Config
    action: 'check_project',            // Optional: identifier for the validation source
    timeout: 1000,                      // Request timeout (in milliseconds)
    per_page: null,                     // Optional: used for listing APIs

    // Injectable Handling
    injectables: true,                  // Whether to fetch injectables
    injectablesVerify: true,            // Verify HMAC signature of injectables
    injectablesPath: null,              // Base path to save or inject injectables (null = system default)
    handleInjectables: false,           // Whether SDK should automatically apply injectables
    injectablesProcessor: null,         // Optional: function or class to process injectables

    // Invalid License Handling
    invalidBehavior: 'modal',           // 'log' | 'modal' | 'redirect' | 'silent'
    redirectUrl: null,                  // Where to redirect on invalid license (if applicable)
    customInvalidMessage: 'This copy is not licensed for production use.', // Message to show if unlicensed
    customInvalidView: null,            // Optional: HTML or handler for custom invalid license UI

    // Hooks
    onReady: null as ((response: any) => void) | null, // Callback on successful license check
};
