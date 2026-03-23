import axios from "axios";

const baseURL = "https://blog-generator-l1v5.onrender.com";

const backendUrl = axios.create({
  baseURL,
  withCredentials: true,
});

export default backendUrl;
