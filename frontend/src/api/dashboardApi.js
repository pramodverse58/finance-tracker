import api from './axiosInstance'

export const getDashboardSummary = (month) =>
  api.get('/dashboard/summary', { params: { month } }).then((res) => res.data)
