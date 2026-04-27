import axios from "axios";

const API = axios.create({
  baseURL: "https://collaborative-workflow-orchestration-hjr6.onrender.com/api"
});

// 🔐 attach token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`; // ✅ FIXED
  }

  return req;
});

// 🔥 GLOBAL ERROR HANDLING (VERY IMPORTANT)
API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    alert(err.response?.data?.msg || "Something went wrong");
    return Promise.reject(err);
  }
);

export default API;