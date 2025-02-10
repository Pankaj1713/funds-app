import AxiosInstance from "./clients";

export const getAPI = (endpoint, params) => {
  return AxiosInstance.get(endpoint, { params }).then((res) => res.data);
};

export const postAPI = (endpoint, payload) => {
  return AxiosInstance.post(endpoint, payload).then((res) => res.data);
};

export const putAPI = (endpoint, payload) => {
  return AxiosInstance.put(endpoint, payload).then((res) => res.data);
};
export const deleteAPI = (endpoint, params) => {
  return AxiosInstance.delete(endpoint, { params }).then((res) => res.data);
};
