import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://blog-generator-l1v5.onrender.com";

const backendUrl = axios.create({
  baseURL,
  withCredentials: true,
});

export default backendUrl;
