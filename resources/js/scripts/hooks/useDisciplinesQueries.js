import axios from "../../axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useDisciplines = () => {
    return useQuery({
        queryKey: ["disciplines"],
        queryFn: async () => {
            const response = await axios.get("/api/admin/disciplines");
            return response.data;
        },
    });
};

export const useCreateDiscipline = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const response = await axios.post("/api/admin/disciplines", data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["disciplines"] });
        },
    });
};

export const useUpdateDiscipline = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const response = await axios.put(
                `/api/admin/disciplines/${data.id}`,
                data
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["disciplines"] });
        },
    });
};

export const useDeleteDiscipline = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const response = await axios.delete(`/api/admin/disciplines/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["disciplines"] });
        },
    });
};

export const useBindDisciplineToTeacher = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const response = await axios.post(
                "/api/admin/disciplines/bind",
                data
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teachers"] });
        },
    });
};
