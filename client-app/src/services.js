import axios from "axios";

const API_ROOT = "/api";

const responseData = res => res.data;

const requests = {
  get: url => axios.get(`${API_ROOT}${url}`).then(responseData),
  post: (url, body) => axios.post(`${API_ROOT}${url}`, body).then(responseData)
};

const Articles = {
  all: page => requests.get(`/articles?limit=10`)
};

const Auth = {
  login: (email, password) => requests.post("/users/login", { user: { email, password } })
};

export default {
  Articles,
  Auth
};
