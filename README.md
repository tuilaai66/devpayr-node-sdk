# DevPayr Node.js SDK

The official Node.js SDK for [DevPayr](https://devpayr.com) — a secure license enforcement and access control system for SaaS platforms, downloadable software, and digital tools.

This SDK allows you to:
- 🔐 Validate license keys in real-time
- 📦 Deliver encrypted injectables conditionally
- 🌐 Enforce domain-based restrictions
- 💵 Check project payment/subscription status
- ⚙️ Manage licenses, projects, and domain rules via API

Whether you're building a backend API, SaaS platform, CLI tool, or desktop software, DevPayr gives you the infrastructure to **protect your code, enforce payments, and control usage** — all without locking you into a specific framework.

## ✨ Features

- ✅ **License Validation** — Verify license keys securely using DevPayr’s API.
- 🔐 **Runtime Enforcement** — Automatically block access when license is invalid, unpaid, or expired.
- 📦 **Injectables Delivery** — Distribute encrypted SDK assets (e.g. config, binaries, tokens) based on license.
- 🌐 **Domain Locking** — Limit usage to specific domains or subdomains.
- 📡 **API Key & License Support** — Works with both API Keys (project scoped) and License Keys (runtime scoped).
- ⚙️ **Service-Oriented Architecture** — Easily access all DevPayr APIs via built-in services.
- 🧩 **Custom Injectable Processor** — Plug in your own logic to decrypt, transform, or store injectables.
- ⚡ **Lightweight & Framework-Agnostic** — Works with Express, NestJS, CLI tools, and more.

## 📦 Installation

Using **npm**:

```bash
npm install @xultech/devpayr
```
Using **yarn**:
```bash
yarn add @xultech/devpayr
```
> Requires Node.js v14+ and TypeScript (if using types).

## 🚀 Getting Started (QuickStart)

Start by bootstrapping DevPayr with your license key and configuration options:

```ts
import { DevPayr } from '@xultech/devpayr';

DevPayr.bootstrap({
  license: 'your-license-key-here',
  secret: 'your secrete key', // for injectables
  base_url: 'https://api.devpayr.com',
  action: 'boot',
  injectables: true,
  onReady: (response) => {
    console.log('✅ License Valid:', response);
  },
  invalidBehavior: 'modal', // or 'redirect', 'silent', 'log'
});
```
If the license is invalid or payment status of the project is unpaid, DevPayr will:
- Show a modal by default (customizable)
- Or redirect / silently fail / log based on `invalidBehavior`

> 🔒 Secure by Default – No valid license, no access.

## ⚙️ Configuration Options

You can customize DevPayr behavior by passing configuration options into the `DevPayr.bootstrap()` method. Some fields are **required**, while others have sensible defaults.

### Required Config

| Key        | Type     | Description                                       |
|------------|----------|---------------------------------------------------|
| `base_url` | `string` | API base URL (e.g., `https://api.devpayr.com/api/v1/`) |
| `secret`   | `string` | Secret used to decrypt injectables (AES-256-CBC)  |

### Default Config (Optional)

| Key                      | Type       | Description |
|--------------------------|------------|-------------|
| `license`                | `string`   | License key for validation (optional if using API key only) |
| `api_key`                | `string`   | API key for project-scoped or global API access |
| `recheck`                | `boolean`  | Whether to skip local cache and revalidate license (`true` by default) |
| `action`                 | `string`   | Optional identifier to include in validation requests (e.g. `'boot'`, `'start'`) |
| `timeout`                | `number`   | Timeout for HTTP requests in ms (`1000` default) |
| `per_page`               | `number`   | Used for paginated listing (e.g., licenses, domains) |
| `injectables`            | `boolean`  | Whether to fetch injectables during validation (`true` by default) |
| `injectablesVerify`      | `boolean`  | Verify HMAC signature of injectables (`true` by default) |
| `injectablesPath`        | `string`   | Directory to write injectables to (optional, otherwise temp path) |
| `handleInjectables`      | `boolean`  | If `true`, SDK will decrypt + store injectables automatically |
| `injectablesProcessor`   | `function` | Custom handler function/class for injectables |
| `invalidBehavior`        | `string`   | `'modal'` (default), `'redirect'`, `'log'`, or `'silent'` |
| `redirectUrl`            | `string`   | URL to redirect to if license is invalid (used if `invalidBehavior = 'redirect'`) |
| `customInvalidMessage`   | `string`   | Message to display or log if license is invalid |
| `customInvalidView`      | `string`   | Custom HTML file to show for unlicensed copies |
| `onReady`                | `function` | Callback executed after successful validation |

---

> You can override any of these when calling `DevPayr.bootstrap({ ... })`.

## 📦 Service API Access

DevPayr provides access to powerful core services through static methods. Once the SDK is bootstrapped, you can use the following service accessors:

```ts
import { DevPayr } from '@xultech/devpayr';

const projectService = DevPayr.projects();
const licenseService = DevPayr.licenses();
const domainService = DevPayr.domains();
const injectableService = DevPayr.injectables();
const paymentService = DevPayr.payments();
```
### 🛠 Available Service Methods
Each service exposes methods for interacting with your licensing and project environment:

| Service         | Methods                                                                |
| --------------- | ---------------------------------------------------------------------- |
| `projects()`    | `list()`, `create()`, `show()`, `update()`, `delete()`                 |
| `licenses()`    | `list()`, `show()`, `create()`, `revoke()`, `reactivate()`, `delete()` |
| `domains()`     | `list()`, `create()`, `show()`, `update()`, `delete()`                 |
| `injectables()` | `list()`, `create()`, `show()`, `update()`, `delete()`, `stream()`     |
| `payments()`    | `checkWithLicenseKey()`, `checkWithApiKey()`                           |

## 💉 Injectables

Injectables are encrypted assets (scripts, config, JSON blobs, etc.) attached to your project via DevPayr. These are securely streamed at runtime and optionally auto-processed.

### 🔐 How Injectables Are Fetched

If enabled in the config (`injectables: true`), injectables are fetched during `DevPayr.bootstrap()` using the license key. The endpoint returns a list of encrypted injectables tied to that license.

Each injectable contains:

- `name`: The file or block name
- `content`: AES-256-CBC encrypted and base64 encoded
- `signature`: HMAC-SHA256 signature of the encrypted content
- `mode`: `append`, `prepend`, `replace`, etc.

### 🧪 How to Override Injectable Processing

You can define a custom processor to handle injectables however you like:

```ts
DevPayr.bootstrap({
  license: 'your-license-key',
  secret: 'your-encryption-secret',
  injectables: true,
  handleInjectables: true,
  injectablesProcessor: (injectable, secret, basePath, verify) => {
    // Decrypt, verify, and save or handle it however you want
    return `/custom/path/${injectable.name}`;
  },
});
```
> Alternatively, implement the full InjectableProcessorContract for structure and consistency.

### 🔏 Signature Verification
By default, DevPayr verifies each injectable’s HMAC signature using the license key or provided secret. You can disable this by setting:
```ts
injectablesVerify: false
```
> ⚠️ Disabling verification may expose your application to tampered injectables. Use with caution.

## 🔐 Crypto & Hash Utilities

DevPayr exposes powerful cryptographic helpers to handle encryption, decryption, hashing, and signature verification. These can be used independently in your application for custom workflows.

### 🔄 `CryptoHelper`

This utility helps encrypt and decrypt strings using `AES-256-CBC` and is perfect for handling secure injectables.

#### 🔓 Decrypt Encrypted Content

```ts
import { CryptoHelper } from '@xultech/devpayr';

const decrypted = CryptoHelper.decrypt(encryptedString, secretKey);
```
- Decrypts base64 strings formatted as `iv::cipherText`
- Uses AES-256-CBC with SHA-256–derived keys
- Throws meaningful exceptions on failure

####  Encrypt Plaintext Content
```ts
const encrypted = CryptoHelper.encrypt('Hello World', secretKey);
```
- Returns base64-encoded `iv::cipherText`
- Securely generates IV with `crypto.randomBytes`

### 🔑 HashHelper
Handles SHA-256 hashing and HMAC signature generation/verification. Ideal for verifying injectables or signing internal payloads.

#### 📦 Generate Hash or Signature
```ts
const hash = HashHelper.hash('some content');
const signature = HashHelper.signature('content', secret);
```

#### ✅ Verify Integrity

```ts
HashHelper.verifyHash(content, expectedHash);         // returns true/false
HashHelper.verifySignature(content, secret, sig);     // returns true/false
```
- Uses constant-time comparison with `crypto.timingSafeEqual`
- Supports secure hash comparison to prevent timing attacks

> These tools are used internally by DevPayr to handle decrypting injectables, verifying payloads, and ensuring content hasn’t been tampered with. You can also use them for your own custom secure workflows.

## 🚨 Failure Modes & Error Handling

DevPayr handles errors and failed license checks gracefully. You can customize how the SDK behaves when validation fails or when an API call throws an error.

### ❌ Invalid License Handling

When a license is invalid, expired, or unauthorized, the SDK triggers the configured **invalid behavior**:

#### Available Modes

| Mode      | Description                                                                 |
|-----------|-----------------------------------------------------------------------------|
| `modal`   | Displays a built-in HTML modal (default) with an error message.            |
| `redirect`| Redirects the user to a custom URL.                                         |
| `log`     | Logs the error to the console using `error_log` (or console in JS).         |
| `silent`  | Does nothing. Use when you want to handle errors manually.                  |

You can configure this using the `invalidBehavior` option:

```ts
invalidBehavior: 'redirect',
redirectUrl: 'https://yourdomain.com/upgrade',
customInvalidMessage: 'Your license is no longer valid.',
customInvalidView: '/path/to/custom.html',
```
#### 🧰 Custom Modal or View
By default, the SDK shows a built-in modal with a styled message. You can replace it with a fully customized HTML file:
```ts
customInvalidView: '/views/custom-unlicensed.html'
```

> This file will be loaded and the `{{message}}` placeholder will be replaced with the failure message.

### 🧱 API Errors and Exceptions

The DevPayr SDK throws structured exceptions that help you understand what went wrong — whether it’s a failed license validation, a network error, or cryptographic issue. All custom errors extend the base `DevPayrException`.

You can import and catch any of these exceptions in your application:

```ts
import {
  DevPayrException,
  LicenseValidationException,
  InjectableVerificationException,
  HttpRequestException,
  CryptoException
} from '@xultech/devpayr';
```

#### ⚠️ Base Exception: DevPayrException
All errors thrown by the SDK extend from this class:
```ts
export class DevPayrException extends Error {
  public readonly name: string = 'DevPayrException';
  constructor(message: string) {
    super(message);
    Error.captureStackTrace?.(this, this.constructor);
  }
}
```
#### 🔐 LicenseValidationException
Thrown when a license check fails or returns an invalid result.
```ts
throw new LicenseValidationException('License is expired or not found.');
```
#### 💾 InjectableVerificationException

Thrown when fetched injectables fail HMAC verification, are tampered with, or cannot be parsed.

```ts
throw new InjectableVerificationException('Invalid signature on downloaded injectable.');
```

#### 🌐 HttpRequestException

Thrown when a DevPayr API call fails meaningfully (e.g., 401, 403, 422). This exception includes status code and response body:

```ts
throw new HttpRequestException('Unauthorized access', 401, response);
```

#### 🔒 CryptoException

Thrown when encryption or decryption fails (e.g., wrong AES key, corrupt payload):

```ts
throw new CryptoException('Unable to decrypt payload');
```
