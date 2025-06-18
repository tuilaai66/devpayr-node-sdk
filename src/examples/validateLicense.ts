import { DevPayr } from '../core/DevPayr';

// Bootstrap DevPayr SDK using a test license
DevPayr.bootstrap({
    license: '01975a4e-bc1c-72fc-a1b5-b509d8f07c75', // Replace with a real key
    base_url: 'http://127.0.0.1:8000/api/v1/', // Or your local dev URL
    injectables: true,
    debug: true,
    onReady: (data : any) => {
        console.log('✅ License validated successfully:', data.data);
    },
    invalidBehavior: 'log', // Options: modal, redirect, log, silent
    secret:"",
    timeout:5000
});
