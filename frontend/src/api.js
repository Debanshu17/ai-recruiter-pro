const envUrl = import.meta.env.VITE_API_URL;
let apiUrl = 'http://localhost:8000';

if (envUrl) {
    if (envUrl.startsWith('http')) {
        apiUrl = envUrl;
    } else {
        apiUrl = `https://${envUrl}`;
    }
}

export const API_URL = apiUrl;
