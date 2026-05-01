import axios from "axios";
import {toast} from "react-toastify";
const API = axios.create({
  baseURL: "https://collaborative-workflow-orchestration-hjr6.onrender.com/api"

  //local run
  // baseURL: "http://localhost:5000/api"
});

 
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});


API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    if (err.response?.data?.msg) {
      toast.error(err.response.data.msg);
    }
    return Promise.reject(err);
  }
);

export default API;