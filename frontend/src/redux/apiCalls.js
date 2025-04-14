import { loginFailure, loginStart, loginSuccess, logout } from "./userRedux";
import { publicRequest, } from "../requestMethods";
import { clearCart, } from "./cartRedux";
import { userRequest} from "../requestMethods"; 

export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await publicRequest.post("/auth/login", user);
    dispatch(loginSuccess(res.data));

    localStorage.setItem("currentUser", JSON.stringify(res.data)); 

    // Az accessToken mentése külön a localStorage-ba
    if (res.data.accessToken) {
      localStorage.setItem("accessToken", res.data.accessToken);
    }
  } catch (err) {
    dispatch(loginFailure());
  }
};

export const Logout = async (dispatch) => {
  try {
    dispatch(logout());
    dispatch(clearCart());
    // Kilépés után töröljük a felhasználót a localStorage-ból
    localStorage.removeItem("currentUser");
    userRequest.defaults.headers.Authorization = "";
  } catch (err) {
    console.log(err);
  }
};

export const SuccessFullOrder = async (dispatch) => {
  try {
    dispatch(clearCart());
  } catch (err) {
    console.log(err);
  }
};


