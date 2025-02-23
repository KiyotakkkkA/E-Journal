import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../axios";

export const useAttendance = (groupId, date) => {
    return useQuery({
        queryKey: ["attendance", groupId, date.toISOString()],
        queryFn: async () => {
            const response = await axios.get("/api/services/attendance", {
                params: {
                    group_id: groupId,
                    date: date.toISOString().split("T")[0],
                },
            });
            return response.data;
        },
        refetchInterval: 2000,
        enabled: !!groupId,
    });
};

export const useUpdateAttendance = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data) => {
            const response = await axios.post("/api/services/attendance", data);
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries([
                "attendance",
                variables.group_id,
                variables.date,
            ]);
        },
    });
};
