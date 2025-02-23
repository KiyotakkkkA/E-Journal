import React, { useState, useCallback } from "react";
import MenuLayout from "@/layouts/MenuLayout";
import { Icon } from "@iconify/react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axios from "@/axios";
import { toast } from "react-toastify";
import {
    useUploadData,
    useDownloadData,
} from "../../../scripts/hooks/useFileManagerQueries";

const uploadOrder = [
    {
        step: 1,
        type: "institutes",
        title: "Институты",
        description: "Загрузите список институтов",
    },
    {
        step: 2,
        type: "cafedras",
        title: "Кафедры",
        description: "Загрузите список кафедр с привязкой к институтам",
    },
    {
        step: 3,
        type: "teachers",
        title: "Преподаватели",
        description: "Загрузите список преподавателей с привязкой к кафедрам",
    },
    {
        step: 4,
        type: "disciplines",
        title: "Дисциплины",
        description: "Загрузите список дисциплин",
    },
    {
        step: 5,
        type: "groups",
        title: "Группы",
        description: "Загрузите список учебных групп",
    },
    {
        step: 6,
        type: "students",
        title: "Студенты",
        description: "Загрузите список студентов с привязкой к группам",
    },
];

export default function FileManager() {
    const [selectedType, setSelectedType] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedTypes, setUploadedTypes] = useState([]);
    const { mutate: uploadDataMutation, isPending: isUploading } =
        useUploadData();
    const { mutate: downloadData, isPending: isDownloading } =
        useDownloadData();

    const dataTypes = [
        {
            id: "teachers",
            title: "Преподаватели",
            icon: "mdi:account-tie",
            description: "Импорт/экспорт списка преподавателей",
            color: "text-blue-600 bg-blue-100",
        },
        {
            id: "institutes",
            title: "Институты",
            icon: "mdi:domain",
            description: "Импорт/экспорт списка институтов",
            color: "text-green-600 bg-green-100",
        },
        {
            id: "cafedras",
            title: "Кафедры",
            icon: "mdi:school",
            description: "Импорт/экспорт списка кафедр",
            color: "text-green-600 bg-green-100",
        },
        {
            id: "disciplines",
            title: "Дисциплины",
            icon: "mdi:book-open-variant",
            description: "Импорт/экспорт списка дисциплин",
            color: "text-orange-600 bg-orange-100",
        },
        {
            id: "groups",
            title: "Группы",
            icon: "mdi:account-group",
            description: "Импорт/экспорт списка групп и их студентов",
            color: "text-indigo-600 bg-indigo-100",
        },
        {
            id: "students",
            title: "Студенты",
            icon: "mdi:account-school",
            description: "Импорт/экспорт списка студентов",
            color: "text-green-600",
        },
    ];

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleUpload = () => {
        if (!selectedFile || !selectedType) {
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("type", selectedType);

        uploadDataMutation(formData, {
            onSuccess: (response) => {
                const { stats } = response;
                let message = "";

                if (selectedType === "groups") {
                    message = `Создано: ${stats.created}, Обновлено: ${stats.updated}`;
                    if (stats.errors > 0) {
                        message += `, Ошибок: ${stats.errors}`;
                    }
                } else {
                    message = `Добавлено: ${stats.added}`;
                    if (stats.duplicates > 0) {
                        message += `, Дубликатов: ${stats.duplicates}`;
                    }
                    if (stats.errors?.length > 0) {
                        message += `, Ошибок: ${stats.errors.length}`;
                    }
                }

                toast.success(`Данные успешно загружены. ${message}`);
                setSelectedFile(null);
                setSelectedType("");
                setUploadedTypes((prev) => [...prev, selectedType]);
            },
            onError: (error) => {
                console.error("Upload error:", error);
                toast.error(
                    error.response?.data?.error || "Ошибка при загрузке данных"
                );
            },
        });
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
                                        value={selectedType}
                                        onChange={(e) => {
                                            setSelectedType(e.target.value);
                                        }}
                                        className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        <option value="">
                                            Выберите тип данных
                                        </option>
                                        {dataTypes.map((type) => (
                                            <option
                                                key={type.id}
                                                value={type.id}
                                            >
                                                {type.title}
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
                                        handleDownloadTemplate(selectedType)
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
                                        onChange={handleFileUpload}
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

                            <div className="mb-6 bg-gray-50 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-gray-800 mb-3 flex items-center gap-2">
                                    <Icon
                                        icon="mdi:information"
                                        className="text-lg text-blue-500"
                                    />
                                    Порядок загрузки данных
                                </h3>
                                <div className="space-y-2">
                                    {uploadOrder.map((item) => (
                                        <div
                                            key={item.type}
                                            className="flex items-center gap-3"
                                        >
                                            <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-sm font-semibold">
                                                {item.step}
                                            </div>
                                            <div className="flex items-center justify-between flex-1">
                                                <p className="text-sm text-gray-900">
                                                    {item.title}
                                                </p>
                                                {uploadedTypes.includes(
                                                    item.type
                                                ) && (
                                                    <Icon
                                                        icon="mdi:check-circle"
                                                        className="text-lg text-green-500"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-3 text-xs text-yellow-800">
                                    <strong>Важно:</strong> Соблюдайте указанный
                                    порядок загрузки для корректной работы
                                    системы
                                </div>
                            </div>

                            <button
                                onClick={handleUpload}
                                disabled={!selectedFile || isUploading}
                                className="w-full bg-purple-600 text-white rounded-xl px-6 py-3
                                    font-medium hover:bg-purple-700 transition-colors disabled:opacity-50
                                    flex items-center justify-center gap-2"
                            >
                                <Icon
                                    icon="mdi:cloud-upload"
                                    className="text-xl"
                                />
                                {isUploading
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
                                    className={`w-full flex items-center gap-4 p-4 rounded-xl border
                                        ${
                                            type.id === "lessons"
                                                ? "opacity-50 cursor-not-allowed border-gray-100"
                                                : "border-gray-200 hover:bg-gray-50"
                                        }
                                        transition-colors group`}
                                >
                                    <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-white transition-colors">
                                        <Icon
                                            icon={type.icon}
                                            className={`text-2xl ${type.color}`}
                                        />
                                    </div>
                                    <span className="flex-1 text-left font-medium text-gray-700">
                                        Выгрузить {type.title.toLowerCase()}
                                        {type.id === "lessons" && " (скоро)"}
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
