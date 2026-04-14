// src/utils/axiosInstance.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000", // ✅ make sure this is your backend URL
  withCredentials: false, // keep false unless using cookies
});

export default instance;
