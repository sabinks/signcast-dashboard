import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});

export default {
    async getScreen() {
        return await apiClient.get('/screens');
    },
    async createScreen(screen) {
        return await apiClient.post('/screens', screen);
    },
    async deleteScreen(id) {
        return await apiClient.delete(`/screens/${id}`);
    },
    async getScreenById(id) {
        return await apiClient.get(`/screens/${id}`);
    }
}