import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useMapElements() {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["mapElements"],
        queryFn: async () => {
            const { data } = await axios.get("/api/map-elements");
            return data;
        },
    });

    const addMapElement = useMutation({
        mutationFn: async (elementData) => {
            const { data } = await axios.post("/api/map-elements", elementData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["mapElements"]);
        },
    });

    const updateMapElement = useMutation({
        mutationFn: async ({ id, ...data }) => {
            const response = await axios.put(`/api/map-elements/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["mapElements"]);
        },
    });

    const deleteMapElement = useMutation({
        mutationFn: async (id) => {
            await axios.delete(`/api/map-elements/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["mapElements"]);
        },
    });

    return {
        data: data || [],
        isLoading,
        addMapElement,
        updateMapElement,
        deleteMapElement,
    };
}
