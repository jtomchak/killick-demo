import axios from "axios";

const API_ROOT = "/api";

const responseBody = res => res.body;

const requests = {
  get: url => axios.get(`${API_ROOT}${url}`).then(responseBody)
};

const Articles = {
  all: page => requests.get(`/articles?limit=10`)
};

export default {
  Articles
};
