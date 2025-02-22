import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../axios";

export const useNotifications = (refetchInterval = 5000) => {
    return useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const response = await axios.get("/api/check-notifications");
            return response.data;
        },
        refetchInterval: refetchInterval,
    });
};

export const useMessages = () => {
    return useQuery({
        queryKey: ["messages"],
        queryFn: async () => {
            const response = await axios.get("/api/messages");
            return response.data;
        },
        refetchInterval: 5000,
    });
};

export const useMarkAsRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            return axios.post(`/api/messages/mark-as-read`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["notifications"]);
        },
    });
};

export const useOnlineUsers = (
    refetchInterval = 30000,
    withoutSelf = true,
    onlyOnline = true
) => {
    return useQuery({
        queryKey: ["online-users", withoutSelf, onlyOnline],
        queryFn: async () => {
            const response = await axios.get(
                `/api/online-users?without_self=${withoutSelf}&only_online=${onlyOnline}`
            );
            return response.data;
        },
        refetchInterval: refetchInterval,
    });
};

export const useSendMessage = (msgFillerFunc, filler, afterSendFunc) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            return axios.post("/api/messages/send", {
                to_user_id: data.to_user_id,
                content: data.content,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["messages"]);
            if (msgFillerFunc) {
                msgFillerFunc(filler);
            }
            if (afterSendFunc) {
                afterSendFunc();
            }
        },
    });
};

export const useTotalData = () => {
    return useQuery({
        queryKey: ["total-data"],
        queryFn: async () => {
            const response = await axios.get("/api/statistics/total");
            return response.data;
        },
    });
};
