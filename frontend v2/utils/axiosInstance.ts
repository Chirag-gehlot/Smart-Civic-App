// src/utils/axiosInstance.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------- REQUEST INTERCEPTOR ----------------
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ---------------- RESPONSE INTERCEPTOR ----------------
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      error.response?.data?.code === "ACCESS_TOKEN_EXPIRED" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        console.log("🔄 Access token expired, attempting refresh...");
        const refreshRes = await axiosInstance.post("/auth/refresh");
        console.log("✅ Refresh success:", refreshRes.data);

        const newAccessToken = refreshRes.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError: any) {
        console.log("❌ Refresh failed:", refreshError.response?.data);
        localStorage.removeItem("accessToken");
        return Promise.reject(refreshError);
      }
    }

    // ⚠️ This block runs when refresh itself returns 401
    if (error.response?.status === 401) {
      console.log("⚠️ 401 received, code:", error.response?.data?.code);
      localStorage.removeItem("accessToken");
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
