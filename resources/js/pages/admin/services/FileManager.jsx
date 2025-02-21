import React, { useState } from "react";
import MenuLayout from "@/layouts/MenuLayout";
import { Icon } from "@iconify/react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axios from "@/axios";
import { toast } from "react-toastify";

export default function FileManager() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadType, setUploadType] = useState("teachers");

    const dataTypes = [
        { id: "teachers", label: "Преподаватели", icon: "mdi:teacher" },
        { id: "institutes", label: "Институты", icon: "mdi:building" },
        { id: "cafedras", label: "Кафедры", icon: "mdi:office-building" },
        { id: "disciplines", label: "Дисциплины", icon: "mdi:book" },
        {
            id: "lessons",
            label: "Занятия",
            icon: "mdi:calendar",
            disabled: true,
        },
    ];

    const uploadMutation = useMutation({
        mutationFn: async () => {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("type", uploadType);
            return axios.post("/api/admin/upload-data", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
        },
        onSuccess: (response) => {
            const { stats } = response.data;
            toast.success(
                <div>
                    <div>Данные успешно загружены!</div>
                    <div className="text-sm mt-1">
                        Добавлено: {stats.added}
                        {stats.duplicates > 0 &&
                            `, Дубликатов: ${stats.duplicates}`}
                    </div>
                    {stats.errors?.length > 0 && (
                        <div className="text-sm mt-1 text-red-500">
                            <div>Ошибки ({stats.errors.length}):</div>
                            <ul className="list-disc pl-4 mt-1">
                                {stats.errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            );
            setSelectedFile(null);
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.error ||
                    "Произошла ошибка при загрузке файла"
            );
        },
    });

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = () => {
        if (uploadType === "lessons") {
            toast.info("Загрузка занятий пока не поддерживается");
            return;
        }
        if (selectedFile) {
            uploadMutation.mutate();
        }
    };

    const handleDownload = async (type) => {
        if (type === "lessons") {
            toast.info("Выгрузка занятий пока не поддерживается");
            return;
        }
        try {
            const response = await axios.get(
                `/api/admin/download-data/${type}`,
                {
                    responseType: "blob",
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${type}_data.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.success("Данные успешно выгружены!");
        } catch (error) {
            toast.error("Произошла ошибка при выгрузке данных");
        }
    };

    const handleDownloadTemplate = async (type) => {
        try {
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
        } catch (error) {
            console.error("Ошибка при скачивании шаблона:", error);
        }
    };

    return (
        <MenuLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Управление данными системы
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="text-sm text-gray-500">
                            Загрузка и выгрузка данных в формате Excel
                        </div>
                        <Link
                            to="/admin"
                            className="text-gray-500 hover:text-gray-600
                                 transition-all duration-200 transform
                                 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center
                                      bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                            >
                                <Icon
                                    icon="mdi:arrow-left"
                                    className="text-xl"
                                />
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-purple-100 rounded-xl">
                                <Icon
                                    icon="mdi:cloud-upload"
                                    className="text-2xl text-purple-600"
                                />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Загрузка данных
                            </h2>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Тип данных
                                </label>
                                <div className="relative">
                                    <select
                                        value={uploadType}
                                        onChange={(e) =>
                                            setUploadType(e.target.value)
                                        }
                                        className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl
                                            px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        {dataTypes.map((type) => (
                                            <option
                                                key={type.id}
                                                value={type.id}
                                                disabled={type.disabled}
                                            >
                                                {type.label}
                                                {type.disabled
                                                    ? " (скоро)"
                                                    : ""}
                                            </option>
                                        ))}
                                    </select>
                                    <Icon
                                        icon="mdi:chevron-down"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                </div>
                                <button
                                    onClick={() =>
                                        handleDownloadTemplate(uploadType)
                                    }
                                    className="mt-2 text-sm text-purple-600 hover:text-purple-700
                                        flex items-center gap-1 transition-colors"
                                >
                                    <Icon
                                        icon="mdi:file-download"
                                        className="text-lg"
                                    />
                                    Скачать шаблон для заполнения
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Excel файл
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".xlsx,.xls"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200
                                            rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                                    >
                                        <Icon
                                            icon="mdi:file-excel"
                                            className="text-2xl text-green-600"
                                        />
                                        <span className="text-gray-600">
                                            {selectedFile
                                                ? selectedFile.name
                                                : "Выберите файл"}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <button
                                onClick={handleUpload}
                                disabled={
                                    !selectedFile || uploadMutation.isPending
                                }
                                className="w-full bg-purple-600 text-white rounded-xl px-6 py-3
                                    font-medium hover:bg-purple-700 transition-colors disabled:opacity-50
                                    flex items-center justify-center gap-2"
                            >
                                <Icon
                                    icon="mdi:cloud-upload"
                                    className="text-xl"
                                />
                                {uploadMutation.isPending
                                    ? "Загрузка..."
                                    : "Загрузить данные"}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-purple-100 rounded-xl">
                                <Icon
                                    icon="mdi:cloud-download"
                                    className="text-2xl text-purple-600"
                                />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Выгрузка данных
                            </h2>
                        </div>

                        <div className="space-y-3">
                            {dataTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => handleDownload(type.id)}
                                    disabled={type.disabled}
                                    className={`w-full flex items-center gap-4 p-4 rounded-xl border
                                        ${
                                            type.disabled
                                                ? "opacity-50 cursor-not-allowed border-gray-100"
                                                : "border-gray-200 hover:bg-gray-50"
                                        }
                                        transition-colors group`}
                                >
                                    <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-white transition-colors">
                                        <Icon
                                            icon={type.icon}
                                            className="text-2xl text-purple-600"
                                        />
                                    </div>
                                    <span className="flex-1 text-left font-medium text-gray-700">
                                        Выгрузить {type.label.toLowerCase()}
                                        {type.disabled && " (скоро)"}
                                    </span>
                                    <Icon
                                        icon="mdi:download"
                                        className="text-xl text-gray-400 group-hover:text-purple-600 transition-colors"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </MenuLayout>
    );
}
