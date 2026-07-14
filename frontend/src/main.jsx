import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { BrowserRouter as Router } from 'react-router-dom';
// Intercept all native fetch calls to replace localhost:5000 with VITE_API_URL dynamically
const originalFetch = window.fetch;
window.fetch = function (url, options) {
  if (typeof url === 'string') {
    // If it is an API request to ngrok
    if (url.startsWith('http://localhost:5000') || url.includes('ngrok-free.dev') || url.includes('ngrok-free.app')) {
      options = options || {};
      options.headers = options.headers || {};
      if (options.headers instanceof Headers) {
        options.headers.set('ngrok-skip-browser-warning', 'true');
      } else if (Array.isArray(options.headers)) {
        options.headers.push(['ngrok-skip-browser-warning', 'true']);
      } else {
        options.headers['ngrok-skip-browser-warning'] = 'true';
      }
    }

    // Replace localhost with ngrok URL
    if (url.startsWith('http://localhost:5000')) {
      const envApiUrl = import.meta.env.VITE_API_URL;
      if (envApiUrl) {
        const baseUrl = envApiUrl.endsWith('/') ? envApiUrl.slice(0, -1) : envApiUrl;
        if (url.startsWith('http://localhost:5000/api')) {
          url = url.replace('http://localhost:5000/api', baseUrl);
        } else {
          const baseDomain = baseUrl.replace(/\/api$/, '');
          url = url.replace('http://localhost:5000', baseDomain);
        }
      }
    }
  }
  return originalFetch(url, options);
};

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  </StrictMode>,
)


