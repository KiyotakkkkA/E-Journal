import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../axios";

export const useTeachers = (verified) => {
    return useQuery({
        queryKey: ["teachers", verified],
        queryFn: async () => {
            const response = await axios.get(
                `/api/admin/teachers?verified=${verified}`
            );
            return response.data;
        },
    });
};

export const useCreateTeacher = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) =>
            await axios.post("/api/admin/teachers", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teachers"] });
        },
    });
};

export const useUpdateTeacher = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) =>
            await axios.put(`/api/admin/teachers/${data.id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teachers"] });
        },
    });
};

export const useDeleteTeacher = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) =>
            await axios.delete(`/api/admin/teachers/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teachers"] });
        },
    });
};
