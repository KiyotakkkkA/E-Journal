import React, { useState, useEffect } from "react";
import MenuLayout from "../../layouts/MenuLayout";
import axios from "../../axios";
import { ServiceCard } from "../../components/common/ServiceCard";

const AdminMenu = () => {
    const [requestsCount, setRequestsCount] = useState(0);

    const services = [
        {
            title: "Заявки на прикрепление",
            description: "Управление заявками на прикрепление к группам",
            icon: "mdi:clipboard-text-clock",
            ref: "/admin/requests",
            color: "#2196F3",
            badge: requestsCount > 0,
            badgeContent: requestsCount,
        },
        {
            title: "Изменить расписание",
            description: "Редактирование расписания занятий для групп",
            icon: "mdi:calendar-edit",
            ref: "/admin/schedule",
            color: "#9C27B0",
        },
        {
            title: "Преподаватели",
            description: "Управление преподавателями",
            icon: "mdi:account-tie",
            ref: "/admin/teachers",
            color: "#FF9800",
        },
        {
            title: "Дисциплины",
            description: "Управление дисциплинами",
            icon: "mdi:book-education",
            ref: "/admin/disciplines",
            color: "#86B32D",
        },
        {
            title: "Структура организации",
            description: "Управление структурами организации",
            icon: "mdi:school",
            ref: "/admin/structure",
            color: "#CD0074",
        },
    ];

    useEffect(() => {
        axios.get("/api/admin/requests").then((res) => {
            setRequestsCount(res.data.requestsCount);
        });
    }, []);

    return (
        <MenuLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Панель администратора
                    </h1>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">
                            Добро пожаловать в панель управления
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <ServiceCard key={index} service={service} />
                    ))}
                </div>
            </div>
        </MenuLayout>
    );
};

export default AdminMenu;
