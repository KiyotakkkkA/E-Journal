import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../axios";

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
