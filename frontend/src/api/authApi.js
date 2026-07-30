import api from './axiosInstance'

export const signup = (payload) => api.post('/auth/signup', payload).then((res) => res.data)

export const login = (payload) => api.post('/auth/login', payload).then((res) => res.data)
