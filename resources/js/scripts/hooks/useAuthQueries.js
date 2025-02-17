import axios from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["logout"],
        mutationFn: async () => {
            const response = await axios.post("/logout");
            return response.data;
        },
        onSuccess: () => {
            queryClient.clear();
            queryClient.removeQueries();
            window.location.href = "/login";
        },
    });
};

export const useRegister = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["register"],
        mutationFn: async (data) => {
            const response = await axios.post("/register", data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["user"]);
            window.location.href = "/";
        },
    });
};

export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["login"],
        mutationFn: async (data) => {
            const response = await axios.post("/login", data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["user"]);
            window.location.href = "/";
        },
    });
};
