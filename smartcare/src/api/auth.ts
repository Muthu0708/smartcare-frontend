import API from "./axios";

export const registerUser = (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return API.post("/auth/register", data);
};

export const loginUser = (data: {
  email: string;
  password: string;
}) => {
  return API.post("/auth/login", data); 
};

export const logoutUser = async () => {
  try {
    await API.post("/auth/logout"); // your logout API
  } catch (err) {
    console.log("Logout API failed (still clearing frontend)");
  }

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "/login";
};