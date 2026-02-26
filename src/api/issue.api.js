import api from "./axios";

export const issueBook = (data) =>
  api.post("/issue", data);

export const returnIssue = (id) =>
  api.post(`/return/${id}`);

export const extendIssue = (id, data) =>
  api.put(`/extend/${id}`, data);

export const getUserIssues = () =>
  api.get("/issue/user");

export const getOverdueIssues = () =>
  api.get("/issue/overdue");