const defaultApiBase = '/api';
const apiBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || defaultApiBase;

export const API_BASE_URL = apiBase;
export const IS_GITHUB_PAGES = typeof window !== 'undefined' && window.location.hostname.includes('github.io');
export const API_NOT_CONFIGURED = import.meta.env.PROD && apiBase === defaultApiBase && IS_GITHUB_PAGES;
export const API_NOT_CONFIGURED_MESSAGE = 'Backend is not configured for this GitHub Pages deployment. Deploy the backend to a public URL and rebuild with VITE_API_BASE_URL.';
