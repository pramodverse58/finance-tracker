import api from './axiosInstance'

export const getBudgets = (month) =>
  api.get('/budgets', { params: { month } }).then((res) => res.data)

export const createBudget = (payload) =>
  api.post('/budgets', payload).then((res) => res.data)

export const updateBudget = (id, payload) =>
  api.put(`/budgets/${id}`, payload).then((res) => res.data)

export const deleteBudget = (id) =>
  api.delete(`/budgets/${id}`).then((res) => res.data)
