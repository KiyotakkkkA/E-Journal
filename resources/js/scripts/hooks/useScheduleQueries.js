import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../axios";

export const useSchedule = (
    groupId,
    dayOfWeek,
    weekType = "all",
    isTeacher = false
) => {
    return useQuery({
        queryKey: ["schedule", groupId, dayOfWeek, weekType, isTeacher],
        queryFn: async () => {
            let url = "/api/admin/schedule";
            const params = new URLSearchParams();

            if (isTeacher) {
                params.append("week_type", "all");
                url += `?${params.toString()}`;
                return axios.get(url).then((response) => response.data);
            } else {
                if (!groupId) return null;
                params.append("group_id", groupId);
                if (dayOfWeek !== "all") {
                    params.append("day_of_week", dayOfWeek);
                }
                params.append("week_type", weekType);
                url += `?${params.toString()}`;
                return axios.get(url).then((response) => response.data);
            }
        },
        enabled: isTeacher || !!groupId,
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
