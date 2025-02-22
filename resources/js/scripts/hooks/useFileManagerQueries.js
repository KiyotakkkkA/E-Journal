import { useMutation } from "@tanstack/react-query";
import axios from "../../axios";

export const useUploadData = () => {
    return useMutation({
        mutationFn: async (formData) => {
            const response = await axios.post(
                "/api/admin/upload-data",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data;
        },
    });
};

export const useDownloadData = () => {
    return useMutation({
        mutationFn: async (type) => {
            const response = await axios.get(
                `/api/admin/download-data/${type}`,
                {
                    responseType: "blob",
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${type}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            return response.data;
        },
    });
};

export const useDownloadTemplate = () => {
    return useMutation({
        mutationFn: async (type) => {
            const response = await axios.get(
                `/api/admin/download-template/${type}`,
                {
                    responseType: "blob",
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `template_${type}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            return response.data;
        },
    });
};
