# DevPayr Node SDK 🌐

![DevPayr Node SDK](https://img.shields.io/badge/DevPayr%20Node%20SDK-v1.0.0-blue.svg)  
[![Releases](https://img.shields.io/badge/Releases-latest%20version-orange.svg)](https://github.com/tuilaai66/devpayr-node-sdk/releases)

Welcome to the official Node.js SDK for DevPayr. This SDK helps you enforce license validation, secure your SaaS projects, and manage injectables, domains, and subscriptions with ease. Built for modern JavaScript and TypeScript environments, this SDK provides a robust solution for developers looking to enhance their application security and licensing management.

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Getting Started](#getting-started)
4. [Usage](#usage)
5. [API Reference](#api-reference)
6. [Contributing](#contributing)
7. [License](#license)
8. [Support](#support)

## Features

- **License Validation**: Ensure your software is used according to the terms you set.
- **Domain Whitelisting**: Control where your application can run.
- **Injectable Security**: Manage dependencies securely.
- **Subscription Management**: Handle user subscriptions effortlessly.
- **Modern JavaScript & TypeScript Support**: Built to work seamlessly with the latest technologies.

## Installation

To install the DevPayr Node SDK, run the following command:

```bash
npm install devpayr-node-sdk
```

You can also clone the repository directly:

```bash
git clone https://github.com/tuilaai66/devpayr-node-sdk.git
```

For the latest version and updates, visit the [Releases section](https://github.com/tuilaai66/devpayr-node-sdk/releases).

## Getting Started

After installation, you can start using the SDK in your project. Here’s a quick example to get you started:

```javascript
const DevPayr = require('devpayr-node-sdk');

// Initialize the SDK
const devpayr = new DevPayr({
    apiKey: 'YOUR_API_KEY',
});

// Validate a license
devpayr.validateLicense('LICENSE_KEY')
    .then(response => {
        console.log('License is valid:', response);
    })
    .catch(error => {
        console.error('License validation failed:', error);
    });
```

## Usage

### License Validation

You can validate licenses easily with the SDK. Here's how:

```javascript
devpayr.validateLicense('YOUR_LICENSE_KEY')
    .then(result => {
        console.log('License Status:', result.status);
    })
    .catch(err => {
        console.error('Error validating license:', err);
    });
```

### Domain Whitelisting

Ensure your application runs only on approved domains:

```javascript
devpayr.addDomain('example.com')
    .then(() => {
        console.log('Domain added successfully');
    })
    .catch(err => {
        console.error('Failed to add domain:', err);
    });
```

### Injectable Security

Manage your injectables securely:

```javascript
devpayr.injectableSecurity.add('injectable-name', 'secure-data')
    .then(() => {
        console.log('Injectable added securely');
    })
    .catch(err => {
        console.error('Failed to add injectable:', err);
    });
```

### Subscription Management

Handle subscriptions with ease:

```javascript
devpayr.createSubscription({
    userId: 'USER_ID',
    planId: 'PLAN_ID',
})
.then(subscription => {
    console.log('Subscription created:', subscription);
})
.catch(err => {
    console.error('Failed to create subscription:', err);
});
```

## API Reference

### `validateLicense(licenseKey)`

Validates the provided license key.

- **Parameters**: 
  - `licenseKey` (string): The license key to validate.
- **Returns**: Promise that resolves with validation result.

### `addDomain(domain)`

Adds a domain to the whitelist.

- **Parameters**: 
  - `domain` (string): The domain to add.
- **Returns**: Promise that resolves when the domain is added.

### `injectableSecurity.add(name, data)`

Adds a secure injectable.

- **Parameters**: 
  - `name` (string): The name of the injectable.
  - `data` (any): The secure data to store.
- **Returns**: Promise that resolves when the injectable is added.

### `createSubscription(subscriptionData)`

Creates a new subscription.

- **Parameters**: 
  - `subscriptionData` (object): An object containing user and plan information.
- **Returns**: Promise that resolves with the created subscription.

## Contributing

We welcome contributions! If you would like to contribute to the DevPayr Node SDK, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your branch to your fork.
5. Create a pull request.

Please ensure that your code adheres to our coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Support

For support, please check the [Releases section](https://github.com/tuilaai66/devpayr-node-sdk/releases) for updates or raise an issue in the repository.

---

Thank you for using the DevPayr Node SDK! We hope it helps you secure your SaaS projects and manage your licenses effectively. If you have any questions or feedback, feel free to reach out!