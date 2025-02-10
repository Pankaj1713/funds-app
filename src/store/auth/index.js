import { toast } from "react-toastify";
import { LOGOUT_SUCCESS, SIGNUP_SUCCESS, LOGIN_SUCCESS } from "./actions";

const initialState = {
  accessToken: "",
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      const { token, ...rest } = action.payload;
      return {
        ...state,
        accessToken: token,
        ...rest,
      };

    case SIGNUP_SUCCESS:
      return { ...state, ...action.payload };

    case LOGOUT_SUCCESS:
      // Remove the token from localStorage and reset the state
      toast.error("Logout success!");
      localStorage.removeItem("accessToken");
      return initialState;

    default:
      return state;
  }
};
