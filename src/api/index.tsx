import axios from 'axios';
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { screenProps } from '../types';
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});

export const handleGetScreens = async () => {
    return await apiClient.get('/screens');
}
export const handleCreateScreen = async (screen: screenProps) => {
    return await apiClient.post('/screens', screen);
}
export const handleEditScreen = async (screen: screenProps, id: string) => {
    return await apiClient.put(`/screens/${id}`, screen);
}
export const handleDeleteScreen = async (id: string) => {
    return await apiClient.delete(`/screens/${id}`);
}
export const handleGetScreenById = async (id: string) => {
    return await apiClient.get(`/screens/${id}`);
}

apiClient.interceptors.response.use(
    function (response) {
        const { status, data } = response;

        if (status == 201 || status == 200) {
            toast.success(data.message, { autoClose: 1000 });
        }
        return response;
    },
    function (error) {
        const { status, data } = error.response;
        if (status == 403) {
            toast.error(data.message, { autoClose: 1000 });
        }
        if (status == 500) {
            toast.error(data.message, { autoClose: 1000 });
        }
        if (status == 405) {
            toast.error(data.message, { autoClose: 1000 });
        }
        return Promise.reject(error);
    }
);
apiClient.interceptors.request.use(
    async (config: any) => {
        if (config.method == "delete") {
            const modal = Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1ea432e6",
                cancelButtonColor: "#9F1853",
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                reverseButtons: true,
            });
            const { isConfirmed } = await modal;
            if (isConfirmed) {
                return config;
            }

        } else {
            return config;
        }
    },
    (error) => {
        return Promise.reject(error);
    }
);