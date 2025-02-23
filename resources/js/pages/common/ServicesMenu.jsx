import React, { useState } from "react";
import MenuLayout from "../../layouts/MenuLayout";
import { ServiceCard } from "../../components/common/ServiceCard";
import { useAuth } from "../../contexts/AuthContext";
import { Icon } from "@iconify/react";

const servicesTextForRoles = {
    isAdmin: {
        groups: {
            description:
                "Создание новой учебной группы и настройка её параметров",
            keywords: [
                "группы",
                "создание",
                "настройка",
                "учебные группы",
                "параметры",
            ],
        },
        attendance: {
            description: "Администрирование посещаемости",
            keywords: ["посещаемость", "администрирование", "группы"],
        },
        reserve: {
            description: "Бронирование аудиторий",
            keywords: ["бронирование", "аудитории", "группы"],
        },
    },
    isTeacher: {
        schedule: {
            description: "Просмотр вашего расписания занятий",
            keywords: ["расписание", "занятия", "пары"],
        },
        attendance: {
            description: "Выставление посещаемости",
            keywords: ["посещаемость", "выставление", "группы"],
        },
        reserve: {
            description: "Бронирование аудиторий",
            keywords: ["бронирование", "аудитории", "группы"],
        },
    },
    isStudent: {
        groups: {
            description: "Просмотр вашей учебной группы",
            keywords: ["группа", "просмотр", "моя группа"],
        },
        schedule: {
            description: "Просмотр расписания занятий вашей группы",
            keywords: ["расписание", "занятия", "пары"],
        },

        attendance: {
            description: "Просмотр посещаемости вашей группы",
            keywords: ["посещаемость", "просмотр", "моя группа"],
        },
        reserve: {
            description: "Бронирование аудиторий",
            keywords: ["бронирование", "аудитории", "группы"],
        },
    },
};

const ServicesMenu = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const { roles } = useAuth();

    const getServiceData = (serviceKey) => {
        for (const role in roles) {
            if (roles[role] && servicesTextForRoles[role]?.[serviceKey]) {
                return servicesTextForRoles[role][serviceKey];
            }
        }
        return null;
    };

    const availableServices = [
        {
            key: "groups",
            title: "Группы",
            icon: "mdi:account-group",
            ref: "/services/groups",
            color: "#4CAF50",
        },
        {
            key: "schedule",
            title: "Расписание",
            icon: "mdi:calendar-clock",
            ref: "/services/schedule",
            color: "#2196F3",
        },
        {
            key: "disciplines",
            title: "Дисциплины",
            icon: "mdi:book-open-variant",
            ref: "/services/disciplines",
            color: "#9C27B0",
        },
        {
            key: "attendance",
            title: "Посещаемость",
            icon: "mdi:clipboard-text-clock",
            ref: "/services/attendance",
            color: "#FF5722",
        },
        {
            key: "reserve",
            title: "Бронирование аудиторий",
            icon: "mdi:book-open-variant",
            ref: "/services/reserve",
            color: "#ab274f",
        },
    ];

    const services = availableServices
        .map((service) => {
            const serviceData = getServiceData(service.key);
            if (!serviceData) return null;

            return {
                ...service,
                description: serviceData.description,
                keywords: serviceData.keywords,
            };
        })
        .filter(Boolean);

    const filteredServices = services.filter((service) => {
        const searchString = searchQuery.toLowerCase();
        return (
            service.title.toLowerCase().includes(searchString) ||
            service.description.toLowerCase().includes(searchString) ||
            service.keywords.some((keyword) =>
                keyword.toLowerCase().includes(searchString)
            )
        );
    });

    return (
        <MenuLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Список сервисов
                        </h1>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Icon
                                icon="mdi:magnify"
                                className="text-xl text-gray-400"
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Поиск по сервисам..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200
                                rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500
                                focus:border-transparent transition-all duration-200
                                placeholder:text-gray-400"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                            >
                                <Icon
                                    icon="mdi:close"
                                    className="text-xl text-gray-400 hover:text-gray-600
                                        transition-colors cursor-pointer"
                                />
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredServices.map((service, index) => (
                            <ServiceCard key={index} service={service} />
                        ))}
                    </div>
                </div>
            </div>
        </MenuLayout>
    );
};

export default ServicesMenu;
