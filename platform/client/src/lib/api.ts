/**
 * CENTRALIZED API CLIENT
 * 
 * 🔒 Security Guarantee:
 * - Every API request MUST include X-Tenant-ID header
 * - Tenant ID is automatically injected from AuthContext
 * - If tenant is missing, request is blocked immediately
 * 
 * 🎯 Usage:
 * - Import `api` from this file
 * - Use `api.get()`, `api.post()`, etc.
 * - NEVER use raw `fetch()` or `axios()` directly
 */

import axios, { AxiosError } from 'axios';

// Base API configuration
export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Request Interceptor: Inject Tenant ID
 * 
 * This runs BEFORE every API request.
 * It ensures tenant context is always present.
 */
api.interceptors.request.use(
    (config) => {
        // Get tenant ID from localStorage (synced with AuthContext)
        const storedUser = localStorage.getItem('email_engine_user');

        if (!storedUser) {
            throw new Error('🚨 SECURITY: No authenticated user found. Blocking API call.');
        }

        let tenantId: string | null = null;

        try {
            const user = JSON.parse(storedUser);
            tenantId = user.tenantId;
        } catch (e) {
            throw new Error('🚨 SECURITY: Invalid user session. Blocking API call.');
        }

        if (!tenantId) {
            throw new Error('🚨 SECURITY: Tenant ID missing. Blocking API call to prevent data leakage.');
        }

        // Inject tenant header
        config.headers['X-Tenant-ID'] = tenantId;

        // Optional: Add auth token if you implement real auth later
        // config.headers['Authorization'] = `Bearer ${user.token}`;

        console.log(`[API] ${config.method?.toUpperCase()} ${config.url} | Tenant: ${tenantId}`);

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor: Handle Errors
 * 
 * Centralized error handling for common scenarios.
 */
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        if (error.response) {
            const status = error.response.status;

            // Handle common HTTP errors
            switch (status) {
                case 400:
                    console.error('[API] Bad Request:', error.response.data);
                    break;
                case 401:
                    console.error('[API] Unauthorized - redirecting to login');
                    // Clear invalid session
                    localStorage.removeItem('email_engine_user');
                    window.location.href = '/login';
                    break;
                case 403:
                    console.error('[API] Forbidden - tenant access denied');
                    break;
                case 404:
                    console.error('[API] Not Found:', error.config?.url);
                    break;
                case 500:
                    console.error('[API] Server Error');
                    break;
                default:
                    console.error('[API] Error:', status, error.response.data);
            }
        } else if (error.request) {
            console.error('[API] Network Error - no response received');
        } else {
            console.error('[API] Request Setup Error:', error.message);
        }

        return Promise.reject(error);
    }
);

/**
 * Type-safe API helpers
 */
export const apiClient = {
    // Campaigns
    campaigns: {
        list: () => api.get('/campaigns'),
        get: (id: string) => api.get(`/campaigns/${id}`),
        create: (data: any) => api.post('/campaigns', data),
        update: (id: string, data: any) => api.patch(`/campaigns/${id}`, data),
        delete: (id: string) => api.delete(`/campaigns/${id}`),
        send: (id: string, data: any) => api.post(`/campaigns/${id}/send`, data),
        preview: (id: string, contact?: any) => api.post(`/campaigns/${id}/preview`, contact),
    },

    // Contacts
    contacts: {
        upload: (file: File, projectId: string) => {
            const formData = new FormData();
            formData.append('file', file);
            return api.post(`/contacts/upload?project_id=${projectId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        },
    },

    // Analytics
    analytics: {
        getStats: (projectId: string) => api.get(`/webhooks/stats?project_id=${projectId}`),
    },
};

export default api;
