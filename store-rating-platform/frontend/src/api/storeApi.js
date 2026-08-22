import axiosInstance from './axiosInstance';

export const getOwnerDashboard = () => axiosInstance.get('/store/dashboard');
