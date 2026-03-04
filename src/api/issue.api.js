import api from "./axios";

export const issueBookAPI = (data) =>
  api.post("/issues/issue", data);

export const returnIssueAPI = (id) =>
  api.post(`/issues/return/${id}`);

export const extendDueDateAPI = (id, newDueDate) =>
  api.put(`/issues/extend/${id}`, { newDueDate });

export const fetchUserIssuesAPI = () =>
  api.get("/issues/user");

export const fetchAllIssuesAPI = () =>
  api.get("/issues");

export const fetchOverdueIssuesAPI = () =>
  api.get("/issues/overdue");

export const fetchBookIssueHistoryAPI = (bookId) =>
  api.get(`/issues/book/${bookId}`);

export const fetchIssueDetailsAPI = (issueId) =>
  api.get(`/issues/${issueId}`);