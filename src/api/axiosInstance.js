import a from "axios";
const url = "https://recipes-backend-id80.onrender.com";

const axios = a.create({
  baseURL: url,
});

export default axios;
