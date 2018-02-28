import axios from "axios";

const API_ROOT = "/api";

const responseData = res => res.data;

const requests = {
  get: url => axios.get(`${API_ROOT}${url}`).then(responseData)
};

const Articles = {
  all: page => requests.get(`/articles?limit=10`)
};

export default {
  Articles
};
