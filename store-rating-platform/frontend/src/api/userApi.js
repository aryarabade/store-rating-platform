import axiosInstance from './axiosInstance';

export const listStoresForUser = (params) => axiosInstance.get('/user/stores', { params });
export const submitOrUpdateRating = (data) => axiosInstance.post('/user/ratings', data);
