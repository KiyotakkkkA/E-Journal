import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../axios";

export const useSchedule = (groupId, dayOfWeek, weekType = "all") => {
    return useQuery({
        queryKey: ["schedule", groupId, dayOfWeek, weekType],
        queryFn: async () => {
            if (!groupId || !dayOfWeek) return null;
            const response = await axios.get(
                `/api/admin/schedule?group_id=${groupId}&day_of_week=${dayOfWeek}&week_type=${weekType}`
            );
            return response.data;
        },
        enabled: !!groupId && !!dayOfWeek,
    });
};

export const useCreateSchedule = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const response = await axios.post("/api/admin/schedule", {
                group_id: data.group_id,
                teacher_id: data.teacher_id,
                discipline_id: data.discipline_id,
                type: data.lesson_type,
                auditorium_id: data.auditorium_id,
                day_of_week: data.day_of_week,
                week_type: data.week_type,
                start_time: data.start_time,
                end_time: data.end_time,
            });
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries([
                "schedule",
                variables.group_id,
                variables.day_of_week,
                variables.week_type,
            ]);
        },
    });
};

export const useUpdateSchedule = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }) => {
            const response = await axios.put(`/api/admin/schedule/${id}`, {
                group_id: data.group_id,
                teacher_id: data.teacher_id,
                discipline_id: data.discipline_id,
                type: data.lesson_type,
                auditorium_id: data.auditorium_id,
                day_of_week: data.day_of_week,
                week_type: data.week_type,
                start_time: data.start_time,
                end_time: data.end_time,
            });
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries([
                "schedule",
                variables.group_id,
                variables.day_of_week,
                variables.week_type,
            ]);
        },
    });
};

export const useDeleteSchedule = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const response = await axios.delete(`/api/admin/schedule/${id}`);
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(["schedule"]);
        },
    });
};
