import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../axios";
import { getGroups } from "../graphql";

export const useGroups = () => {
    return useQuery({
        queryKey: ["groups"],
        queryFn: async () => {
            const response = await getGroups();
            return response.data.groups;
        },
    });
};

export const useGroupStudents = (groupId) => {
    return useQuery({
        queryKey: ["groupStudents", groupId],
        queryFn: async (groupId) => {
            const response = await axios.get(
                `/api/admin/groups/students?group_id=${groupId}`
            );
            return response.data.students;
        },
    });
};

export const useCreateGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["createGroup"],
        mutationFn: async (groupData) => {
            const response = await axios.post("/admin/groups", groupData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["groups"]);
        },
    });
};

export const useUpdateGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (groupData) => {
            const response = await axios.put(
                `/admin/groups/${groupData.id}`,
                groupData
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["groups"]);
        },
    });
};

export const useDeleteGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id) => {
            const response = await axios.delete(`/admin/groups/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["groups"]);
        },
    });
};
