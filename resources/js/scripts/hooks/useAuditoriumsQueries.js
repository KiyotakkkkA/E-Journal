import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../axios";

export function useInteractiveAuditoriums() {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["auditoriums"],
        queryFn: async () => {
            const { data } = await axios.get("/api/services/auditoriums");
            return data;
        },
    });

    const updateAuditorium = useMutation({
        mutationFn: async ({ id, ...data }) => {
            const response = await axios.put(
                `/api/admin/auditoriums/${id}`,
                data
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["auditoriums"]);
        },
    });

    return {
        data: data || [],
        isLoading,
        updateAuditorium,
    };
}

export const useAuditoriums = () => {
    return useQuery({
        queryKey: ["auditoriums"],
        queryFn: async () => {
            const response = await axios.get("/api/admin/auditoriums");
            return response.data;
        },
    });
};

export const useCreateAuditorium = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const response = await axios.post("/api/admin/auditoriums", data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["auditoriums"] });
        },
    });
};

export const useUpdateAuditorium = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...data }) => {
            const response = await axios.put(
                `/api/admin/auditoriums/${id}`,
                data
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["auditoriums"] });
        },
    });
};

export const useDeleteAuditorium = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const response = await axios.delete(`/api/admin/auditoriums/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["auditoriums"] });
        },
    });
};
