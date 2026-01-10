export const testBackendConnection = async (): Promise<{ connected: boolean; error?: string }> => {
  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL as string;
  const cleanBaseUrl = API_BASE_URL.replace(/\/+$/, "");
  
  try {
    console.log("Testing connection to:", cleanBaseUrl);
    const response = await fetch(`${cleanBaseUrl}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    console.log("Connection test response status:", response.status);
    return { connected: response.status < 500 };
  } catch (error) {
    console.error("Connection test error:", error);
    console.error("Full error details:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { 
      connected: false, 
      error: errorMessage.includes("fetch") || errorMessage.includes("Failed to fetch")
        ? `Cannot reach server at ${cleanBaseUrl}. The server might be sleeping (Render free tier - wait 30-60 seconds) or unreachable. Please wait a moment and try again.`
        : errorMessage
    };
  }
};
