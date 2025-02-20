import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getInstitutes, getCafedras, getDisciplines } from "../graphql";
import axios from "axios";

export const useInstitutes = () => {
    return useQuery({
        queryKey: ["institutes"],
        queryFn: async () => {
            const response = await getInstitutes();
            return response.data.institutes;
        },
    });
};

export const useCreateInstitute = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (institute) => {
            const response = await axios.post(
                "/api/admin/institutes",
                institute
            );
            return response.data.institute;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["institutes"] });
        },
    });
};

export const useDeleteInstitute = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (institute) => {
            const response = await axios.delete(
                `/api/admin/institutes/${institute.id}`
            );
            return response.data.institute;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["institutes"] });
        },
    });
};

export const useUpdateInstitute = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (institute) => {
            const response = await axios.put(
                `/api/admin/institutes/${institute.id}`,
                institute
            );
            return response.data.institute;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["institutes"] });
        },
    });
};

export const useCafedras = (instituteId = null) => {
    return useQuery({
        queryKey: ["cafedras", instituteId],
        queryFn: async () => {
            const response = await getCafedras(instituteId);
            return response.data.cafedras;
        },
        enabled: !!instituteId,
    });
};

export const useCreateCafedra = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (cafedra) => {
            const response = await axios.post("/api/admin/cafedras", cafedra);
            return response.data.cafedra;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["institutes"] });
            queryClient.invalidateQueries({ queryKey: ["cafedras"] });
        },
    });
};

export const useDeleteCafedra = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (cafedra) => {
            const response = await axios.delete(
                `/api/admin/cafedras/${cafedra.id}`
            );
            return response.data.cafedra;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cafedras"] });
        },
    });
};

export const useUpdateCafedra = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (cafedra) => {
            const response = await axios.put(
                `/api/admin/cafedras/${cafedra.id}`,
                cafedra
            );
            return response.data.cafedra;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cafedras"] });
        },
    });
};

export const useDisciplines = () => {
    return useQuery({
        queryKey: ["disciplines"],
        queryFn: async () => {
            const response = await getDisciplines();
            return response.data.disciplines;
        },
    });
};

export const useAssignTeachers = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const response = await axios.post(
                `/api/admin/cafedras/${data.id}/teachers`,
                data
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cafedra-teachers"] });
            queryClient.invalidateQueries({ queryKey: ["cafedras"] });
        },
    });
};

export const useCafedraTeachers = (cafedraId = null) => {
    return useQuery({
        queryKey: ["cafedra-teachers", cafedraId],
        queryFn: async () => {
            const response = await axios.get(
                `/api/admin/cafedras/${cafedraId}/teachers`
            );
            return response.data;
        },
        enabled: !!cafedraId,
    });
};

export const useRemoveTeacher = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const response = await axios.delete(
                `/api/admin/cafedras/${data.cafedraId}/teachers`,
                {
                    data: {
                        teacherId: data.teacherId,
                    },
                }
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cafedra-teachers"] });
            queryClient.invalidateQueries({ queryKey: ["cafedras"] });
        },
    });
};
