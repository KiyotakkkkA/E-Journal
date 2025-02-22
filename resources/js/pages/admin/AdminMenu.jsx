import React, { useState, useEffect } from "react";
import MenuLayout from "../../layouts/MenuLayout";
import { ServiceCard } from "../../components/common/ServiceCard";
import { Icon } from "@iconify/react";
import { observer } from "mobx-react-lite";
import { notificationsStore } from "../../stores/notificationsStore";

const AdminMenu = observer(() => {
    const [searchQuery, setSearchQuery] = useState("");
    const requestsCount = notificationsStore.getRequestsCount();

    const services = [
        {
            title: "Заявки на прикрепление",
            description: "Управление заявками на прикрепление к группам",
            icon: "mdi:clipboard-text-clock",
            ref: "/admin/requests",
            color: "#2196F3",
            badge: requestsCount > 0,
            badgeContent: requestsCount,
            keywords: ["заявки", "прикрепление", "группы", "запросы"],
        },
        {
            title: "Изменить расписание",
            description: "Редактирование расписания занятий для групп",
            icon: "mdi:calendar-edit",
            ref: "/admin/schedule",
            color: "#9C27B0",
            keywords: ["расписание", "занятия", "редактирование", "график"],
        },
        {
            title: "Преподаватели",
            description: "Управление преподавателями",
            icon: "mdi:account-tie",
            ref: "/admin/teachers",
            color: "#FF9800",
            keywords: ["преподаватели", "учителя", "сотрудники"],
        },
        {
            title: "Дисциплины",
            description: "Управление дисциплинами",
            icon: "mdi:book-education",
            ref: "/admin/disciplines",
            color: "#86B32D",
            keywords: ["дисциплины", "предметы", "курсы"],
        },
        {
            title: "Структура организации",
            description: "Управление структурами организации",
            icon: "mdi:school",
            ref: "/admin/structure",
            color: "#CD0074",
            keywords: ["структура", "организация", "институты", "кафедры"],
        },
        {
            title: "Загрузить / выгрузить данные",
            description:
                "Выгрузить данные системы в файл или загрузить данные из файла",
            icon: "mdi:file-arrow-up-down",
            ref: "/admin/data",
            color: "#200772",
            keywords: ["данные", "импорт", "экспорт", "файлы", "excel"],
        },
    ];

    const filteredServices = services.filter((service) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            service.title.toLowerCase().includes(searchLower) ||
            service.description.toLowerCase().includes(searchLower) ||
            service.keywords.some((keyword) =>
                keyword.toLowerCase().includes(searchLower)
            )
        );
    });

    return (
        <MenuLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Панель администратора
                        </h1>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">
                                Добро пожаловать в панель управления
                            </span>
                        </div>
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
});

export default AdminMenu;
