import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../axios";
import { toast } from "react-hot-toast";

export const useUserInfo = () => {
    return useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const response = await axios.get("/api/user");
            return response.data;
        },
    });
};

export const useUserRequests = () => {
    return useQuery({
        queryKey: ["userRequests"],
        queryFn: async () => {
            const response = await axios.get("/api/user/student");
            return response.data.requests;
        },
    });
};

export const useSendRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (requestData) => {
            const response = await axios.post("/user/student", requestData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["userRequests"]);
            queryClient.invalidateQueries(["user"]);
            window.location.reload();
        },
    });
};

export const useSendVerificationEmail = () => {
    return useMutation({
        mutationFn: async () =>
            await axios.post("/email/verification-notification"),
        onSuccess: () => {
            toast.success("Код подтверждения отправлен на вашу почту");
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message ||
                    "Не удалось отправить код подтверждения"
            );
        },
    });
};

export const useVerifyEmail = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (code) => await axios.post("/email/verify", { code }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
            toast.success("Email успешно подтвержден");
            window.location.reload();
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Не удалось подтвердить email"
            );
        },
    });
};
