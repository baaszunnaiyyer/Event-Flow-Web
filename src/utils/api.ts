const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "https://eventflow-api-kt8v.onrender.com";

// Ensure base URL doesn't end with a slash
const cleanBaseUrl = API_BASE_URL.replace(/\/+$/, "");
// Ensure endpoint starts with a slash
const normalizeEndpoint = (endpoint: string) => endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

console.log("API Base URL:", cleanBaseUrl);

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export const api = {
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = localStorage.getItem("token");
    const normalizedEndpoint = normalizeEndpoint(endpoint);
    const url = `${cleanBaseUrl}${normalizedEndpoint}`;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && { Authorization: token }), // Backend expects just the token, not "Bearer {token}"
      ...options.headers,
    };

    console.log(`API Request: ${options.method || "GET"} ${url}`);
    console.log("Request headers:", headers);
    console.log("Request body:", options.body);

    try {
      const fetchOptions: RequestInit = {
        ...options,
        headers,
        mode: "cors", // Explicitly set CORS mode
      };

      const response = await fetch(url, fetchOptions);

      console.log(`API Response Status: ${response.status}`);

      // Handle non-JSON responses
      const contentType = response.headers.get("content-type");
      let data: any = {};
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json().catch(() => ({}));
      } else {
        const text = await response.text();
        if (text) {
          try {
            data = JSON.parse(text);
          } catch {
            data = { message: text };
          }
        }
      }

      if (!response.ok) {
        console.error("API Error:", data);
        return {
          error: data.message || data.error || `Request failed with status ${response.status}`,
        };
      }

      return { data: data as T, message: data.message };
    } catch (error) {
      console.error("Fetch Error:", error);
      console.error("Request URL was:", url);
      console.error("Full error:", error);
      
      let errorMessage = "Network error";
      if (error instanceof TypeError) {
        if (error.message.includes("fetch") || error.message.includes("Failed to fetch")) {
          errorMessage = `Failed to connect to server at ${cleanBaseUrl}. This might be due to:
- Server is sleeping (Render free tier - wait 30-60 seconds for first request)
- CORS configuration issue
- Network connectivity problem
- Server is down

Please verify the server is running and try again.`;
        } else {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      return {
        error: errorMessage,
      };
    }
  },

  get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  },

  post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  delete<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "DELETE",
      body: body ? JSON.stringify(body) : undefined,
    });
  },
};
