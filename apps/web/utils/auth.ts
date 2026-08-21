import { apiClient } from "@/core/services/client";

/**
 * Triggers an OAuth login pipeline by forcing a full browser redirect 
 * to your NestJS backend endpoint.
*/
const apiBaseUrl = 'http://localhost:3000';

export function signIn(provider: 'google' | 'github') {
  // Pull your API base URL from env variables (e.g., http://localhost:3000 or production api)
  
  // Directly point the browser window to your NestJS auth gate route
  window.location.href = `${apiBaseUrl}/auth/${provider}`;
}

export async function signOut() {
  try {
    // 🎯 Hit the backend route to strip the HttpOnly cookies securely
    await apiClient('/auth/logout', { method: 'POST' });
  } catch (error) {
    console.error("Backend sign-out sync failed:", error);
  } finally {
    localStorage.removeItem('dm_tz');
    // Always clear local memory and redirect, even if the network call dropped
    window.location.href = '/login';
  }
}