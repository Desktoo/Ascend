const baseUrl = "http://localhost:3000";

// Endpoints where a 401 is a final answer (bad credentials, no session yet),
// not a signal to silently refresh and retry.
const AUTH_ENDPOINTS = ["/auth/login", "/auth/signup", "/auth/refresh"];

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const config: RequestInit = {
    ...options,
    credentials: "include",
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, config);

    if (!response.ok) {
      const isAuthEndpoint = AUTH_ENDPOINTS.some((route) =>
        endpoint.startsWith(route),
      );

      if (response.status === 401 && !isAuthEndpoint) {
        console.warn(
          `[Access Token Expired] Attempting silent refresh for route: ${endpoint}`,
        );

        const refreshSuccess = await handleTokenRefresh();

        if (refreshSuccess) {
          const retryResponse = await fetch(`${baseUrl}${endpoint}`, config);

          if (!retryResponse.ok) {
            const retryErrorData = await retryResponse
              .json()
              .catch(() => ({}));
            throw new Error(
              retryErrorData.message ||
                `HTTP Error: ${retryResponse.status}`,
            );
          }

          return (await retryResponse.json()) as T;
        }

        // Refresh itself failed — surface this distinctly from a normal
        // API error so the UI can tell "your session died" apart from
        // "this specific request failed".
        throw new Error("SESSION_EXPIRED");
      }

      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Network Error";
    console.error(`[API Client Error] Route: ${endpoint}`, errorMessage);
    throw new Error(errorMessage);
  }
}

export async function handleTokenRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${baseUrl}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (res.ok) {
      console.log("[Token Rotation Successful] New access token injected");
      return true;
    }

    console.error("[Refresh Token Expired] Session dead.");
    return false;
  } catch (error) {
    console.error("[Refresh Failed] Network error during token rotation", error);
    return false;
  }
}