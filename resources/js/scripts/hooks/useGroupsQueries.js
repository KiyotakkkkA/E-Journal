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
        retry: 1,
        retryDelay: 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        onError: (error) => {
            console.error("Error fetching groups:", error);
        },
    });
};

export const useGroupStudents = (groupId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["groupStudents", groupId],
        mutationFn: async () => {
            const response = await axios.get(
                `/api/services/groups/students?group_id=${groupId}`
            );
            return response.data.students;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["groupStudents", groupId], data);
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
