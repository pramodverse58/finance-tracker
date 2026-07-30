import api from './axiosInstance'

export const getTransactions = (params = {}) =>
  api.get('/transactions', { params }).then((res) => res.data)

export const createTransaction = (payload) =>
  api.post('/transactions', payload).then((res) => res.data)

export const updateTransaction = (id, payload) =>
  api.put(`/transactions/${id}`, payload).then((res) => res.data)

export const deleteTransaction = (id) =>
  api.delete(`/transactions/${id}`).then((res) => res.data)
