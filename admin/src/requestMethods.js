import axios from "axios";

const BASE_URL = "http://localhost:5000/api/";

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});


export const userRequest = axios.create({
  baseURL: BASE_URL,
});

userRequest.interceptors.request.use((config) => {
  const root = JSON.parse(localStorage.getItem("persist:root"))?.user;
  const currentUser = root && JSON.parse(root).currentUser;
  const TOKEN = currentUser?.accessToken;

  if (TOKEN) {
    config.headers.token = `Bearer ${TOKEN}`;
  }

  return config;
});
