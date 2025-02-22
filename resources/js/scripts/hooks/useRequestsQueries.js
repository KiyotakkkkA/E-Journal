import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../axios";

export const useRequests = () => {
    return useQuery({
        queryKey: ["requests"],
        queryFn: async () => {
            const response = await axios.get("/api/admin/requests/all");
            return response.data.requests;
        },
    });
};

export const useApproveRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (requestId) =>
            await axios.post(`/admin/requests/${requestId}/approve`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["requests"] });
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });
};

export const useRejectRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (requestId) =>
            await axios.post(`/admin/requests/${requestId}/reject`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["requests"] });
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });
};
