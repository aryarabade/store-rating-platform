import axiosInstance from './axiosInstance';

export const getDashboardStats = () => axiosInstance.get('/admin/dashboard');

export const addUser = (data) => axiosInstance.post('/admin/users', data);
export const listUsers = (params) => axiosInstance.get('/admin/users', { params });
export const getUserDetails = (id) => axiosInstance.get(`/admin/users/${id}`);

export const addStore = (data) => axiosInstance.post('/admin/stores', data);
export const listStores = (params) => axiosInstance.get('/admin/stores', { params });
export const updateStore = (id, data) => axiosInstance.put(`/admin/stores/${id}`, data);
export const deleteStore = (id) => axiosInstance.delete(`/admin/stores/${id}`);
