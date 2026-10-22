import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
});

export const predictImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/predict', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getMetrics = async () => {
    const response = await api.get('/model-metrics');
    return response.data;
};
