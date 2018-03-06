import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
  timeout: 1000,
  headers: {
    "Content-Type": "application/json"
  }
});

const setToken = (token = null) =>
  (axiosInstance.defaults.headers.common["Authorization"] = token ? `Bearer ${token}` : "");

const responseData = res => res.data;

const requests = {
  get: url => axiosInstance.get(`${url}`).then(responseData),
  post: (url, body) => axiosInstance.post(`${url}`, body).then(responseData)
};

const Articles = {
  all: page => requests.get(`/articles?limit=10`)
};

const Auth = {
  currentUser: () => requests.get("/user"),
  login: (email, password) => requests.post("/users/login", { user: { email, password } }),
  register: (username, email, password) =>
    requests.post("/users", { user: { username, email, password } })
};

export default {
  Articles,
  Auth,
  setToken
};
