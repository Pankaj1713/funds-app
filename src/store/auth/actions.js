export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";

export const loginSuccess = (payload) => ({
  type: LOGIN_SUCCESS,
  payload,
});
export const logOutSuccess = () => ({
  type: LOGOUT_SUCCESS,
});
