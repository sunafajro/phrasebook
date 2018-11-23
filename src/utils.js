import axios from "axios";

export const getCSRF = () => {
  return axios.get("/csrf");
};
