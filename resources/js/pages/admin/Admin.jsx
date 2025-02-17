import React, { useState, useEffect } from "react";
import MenuLayout from "../../layouts/MenuLayout";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import axios from "../../axios";

const ServiceCard = ({ service }) => (
    <Link to={service.ref}>
        <div
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6
                  flex flex-col h-full group cursor-pointer
                  transition-all duration-200"
        >
            <div className="flex justify-between items-start mb-4">
                <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center
                         transition-all duration-200 group-hover:scale-105"
                    style={{ backgroundColor: service.color }}
                >
                    <Icon icon={service.icon} className="text-white text-2xl" />
                </div>
                {service.badge && (
                    <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full
                             text-xs font-medium bg-red-100 text-red-600"
                    >
                        {service.badgeContent}
                    </span>
                )}
            </div>

            <div className="flex-grow">
                <h3
                    className="text-lg font-semibold text-gray-900 mb-2
                         group-hover:text-purple-600 transition-colors duration-200"
                >
                    {service.title}
                </h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
            </div>

            <div
                className="inline-flex w-full items-center justify-center px-4 py-2 mt-4
                     bg-purple-600 text-white rounded-lg
                     group-hover:bg-purple-700 group-hover:shadow-md
                     transition-all duration-200"
            >
                Перейти
            </div>
        </div>
    </Link>
);

const Admin = ({ canViewAdminPanel }) => {
    const [requestsCount, setRequestsCount] = useState(0);

    const services = [
        {
            title: "Группы",
            description:
                "Создание новой учебной группы и настройка её параметров",
            icon: "mdi:account-group",
            ref: "/admin/groups",
            color: "#4CAF50",
        },
        {
            title: "Заявки на прикрепление",
            description: "Управление заявками на прикрепление к группам",
            icon: "mdi:file-document-edit",
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
    ];

    useEffect(() => {
        axios.get("/api/admin/requests").then((res) => {
            setRequestsCount(res.data.requestsCount);
        });
    }, []);

    return (
        <MenuLayout canViewAdminPanel={canViewAdminPanel}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <ServiceCard key={index} service={service} />
                    ))}
                </div>
            </div>
        </MenuLayout>
    );
};

export default Admin;
