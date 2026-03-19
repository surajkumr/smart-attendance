import API from "./api";

export const getAllUsers = () =>
  API.get("/admin/users");

export const getAllClasses = () =>
  API.get("/admin/classes");

export const createClass = (data) =>
  API.post("/admin/class", data);