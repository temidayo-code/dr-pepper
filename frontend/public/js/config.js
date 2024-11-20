const CONFIG = {
    API_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:3000'
        : 'https://your-backend-url.vercel.app'
};

if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
} 