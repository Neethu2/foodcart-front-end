import axios from "axios";
console.log("BASE URL:", import.meta.env.VITE_BASE_URL);
const API = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("BASE URL:", import.meta.env.VITE_BASE_URL);

export const registerUser = async (data: {
  username: String;
  email: String;
  password: String;
}) => {
  const response = await API.post("/users/register", data);
  return response.data;
};

export const loginUser = async (data: { email: String; password: String }) => {
  const response = await API.post("/users/login", data);
  return response.data;
};
