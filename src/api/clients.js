import axios from "axios";
import { toast } from "react-toastify";
import store from "../store";

const unauthorizedCode = [401];

const BaseUrl = "http://68.183.47.168:5000/api/v1";

const AxiosInstance = axios.create({
  timeout: 60000,
  baseURL: BaseUrl,
  headers: {
    "ngrok-skip-browser-warning": "skip-browser-warning",
  },
});

AxiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = store?.getState()?.auth?.accessToken;

    if (accessToken) {
      config.headers["token"] = `${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    toast.error(response?.data?.message || "Server error");
    // if (response && unauthorizedCode.includes(response?.status)) {
    //   store.dispatch(onSignOutSuccess());
    // }
    return Promise.reject(error);
  }
);

export default AxiosInstance;
