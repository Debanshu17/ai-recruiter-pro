const envUrl = import.meta.env.VITE_API_URL;
let apiUrl = 'http://localhost:8000';

if (envUrl) {
    let host = envUrl;
    // If Render injects just the internal service name, append the public domain
    if (!host.includes('.') && !host.includes('localhost')) {
        host = `${host}.onrender.com`;
    }
    
    if (host.startsWith('http')) {
        apiUrl = host;
    } else {
        apiUrl = `https://${host}`;
    }
}

export const API_URL = apiUrl;
