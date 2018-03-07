import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json"
  }
});

const setToken = (token = null) =>
  (axiosInstance.defaults.headers.common["Authorization"] = token ? `Bearer ${token}` : "");

const responseData = res => res.data;

const requests = {
  get: url => axiosInstance.get(`${url}`).then(responseData),
  post: (url, body) => axiosInstance.post(`${url}`, body).then(responseData),
  put: (url, body) => axiosInstance.put(`${url}`, body).then(responseData)
};

const Articles = {
  all: page => requests.get(`/articles?limit=10`),
  get: slug => requests.get(`/articles/${slug}`)
};

const Comments = {
  forArticle: slug => requests.get(`/articles/${slug}/comments`)
};

const Auth = {
  currentUser: () => requests.get("/user"),
  login: (email, password) => requests.post("/users/login", { user: { email, password } }),
  register: (username, email, password) =>
    requests.post("/users", { user: { username, email, password } }),
  save: user => requests.put("/user", { user })
};

export default {
  Articles,
  Auth,
  Comments,
  setToken
};
