import { jwtDecode } from "jwt-decode";

export const storeToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
};
export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
};

export const getUser = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return jwtDecode(token);
  }
};
