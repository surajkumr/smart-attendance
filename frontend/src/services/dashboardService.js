import API from "./api";

export const getDashboardStats = (classId = "") =>
  API.get(`/dashboard/stats${classId ? `?classId=${classId}` : ""}`);

export const getMonthlyData = () =>
  API.get("/dashboard/monthly");

export const getDefaulters = () =>
  API.get("/dashboard/defaulters");

export const getStudentAnalytics = () =>
  API.get("/dashboard/student");