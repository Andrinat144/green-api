import axios from "axios";

export const axiosApiClient = axios.create({
  baseURL: "https://api.green-api.com/"
});