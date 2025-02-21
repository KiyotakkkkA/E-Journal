import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../axios";

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

export const useOnlineUsers = (refetchInterval = 30000, withoutSelf = true) => {
    return useQuery({
        queryKey: ["online-users", withoutSelf],
        queryFn: async () => {
            const response = await axios.get(
                `/api/online-users?without_self=${withoutSelf}`
            );
            return response.data;
        },
        refetchInterval: refetchInterval,
    });
};

export const useSendMessage = (msgFillerFunc, filler) => {
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
            msgFillerFunc(filler);
        },
    });
};

export const useTotalData = () => {
    return useQuery({
        queryKey: ["total-data"],
        queryFn: async () => {
            const response = await axios.get("/api/statistics/total");
            console.log(response.data);
            return response.data;
        },
    });
};
