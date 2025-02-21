import React, { useEffect } from "react";
import MenuLayout from "../layouts/MenuLayout";
import OnlineUsers from "../layouts/OnlineUsers";
import ChatWindow from "../components/Chat/ChatWindow";
import { mainPageStore } from "../stores/mainPageStore";
import { observer } from "mobx-react-lite";
import { Icon } from "@iconify/react";
import { useTotalData } from "../scripts/hooks/useRealTimeQueries";
import { useSyncData } from "../scripts/hooks/common";
const StatCard = ({ icon, title, value, trend, color }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-start justify-between">
            <div className={`p-3 rounded-lg bg-opacity-10 ${color.bg}`}>
                <Icon icon={icon} className={`text-2xl ${color.text}`} />
            </div>
            {trend && (
                <span
                    className={`flex items-center text-sm font-medium ${
                        trend > 0 ? "text-green-600" : "text-red-600"
                    }`}
                >
                    <Icon
                        icon={
                            trend > 0 ? "mdi:trending-up" : "mdi:trending-down"
                        }
                        className="mr-1"
                    />
                    {Math.abs(trend)}%
                </span>
            )}
        </div>
        <h3 className="mt-4 text-2xl font-semibold text-gray-900">{value}</h3>
        <p className="text-sm text-gray-600">{title}</p>
    </div>
);

const ActivityItem = ({ icon, title, description, time, color }) => (
    <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
        <div className={`p-2 rounded-lg ${color}`}>
            <Icon icon={icon} className="text-xl text-white" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">{title}</p>
            <p className="text-sm text-gray-600 truncate">{description}</p>
        </div>
        <time className="text-sm text-gray-500">{time}</time>
    </div>
);

const Main = observer(() => {
    const { data, isLoading } = useTotalData();
    const totalStats = mainPageStore.getTotalData();
    const syncData = useSyncData();
    useEffect(() => {
        if (data) {
            syncData(data, "totalData", isLoading, mainPageStore);
        }
    }, [data]);

    const stats = [
        {
            icon: "mdi:account-group",
            title: "Активных студентов",
            value: totalStats.students,
            color: { bg: "bg-blue-500", text: "text-blue-500" },
        },
        {
            icon: "mdi:school",
            title: "Преподавателей",
            value: totalStats.teachers,
            color: { bg: "bg-purple-500", text: "text-purple-500" },
        },
        {
            icon: "mdi:book-education",
            title: "Учебных групп",
            value: totalStats.groups,
            color: { bg: "bg-orange-500", text: "text-orange-500" },
        },
        {
            icon: "mdi:calendar-check",
            title: "Занятий сегодня",
            value: "42",
            color: { bg: "bg-green-500", text: "text-green-500" },
        },
    ];

    const recentActivity = [
        {
            icon: "mdi:account-plus",
            title: "Новая заявка на прикрепление",
            description: "Студент Иванов И.И. подал заявку в группу ПИ-201",
            time: "5 мин назад",
            color: "bg-blue-500",
        },
        {
            icon: "mdi:calendar-edit",
            title: "Изменение в расписании",
            description: "Перенос занятия по Математике для группы ИВТ-301",
            time: "2 часа назад",
            color: "bg-purple-500",
        },
        {
            icon: "mdi:school",
            title: "Новая кафедра",
            description: "Создана кафедра 'Информационные технологии'",
            time: "5 часов назад",
            color: "bg-orange-500",
        },
    ];

    return (
        <MenuLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Обзор системы
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">
                            Последнее обновление:{" "}
                            {new Date().toLocaleTimeString()}
                        </span>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Icon
                                icon="mdi:refresh"
                                className="text-xl text-gray-600"
                            />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8">
                        <ChatWindow />
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <OnlineUsers />

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Последние действия
                            </h2>
                            <div className="space-y-3">
                                {recentActivity.map((activity, index) => (
                                    <ActivityItem key={index} {...activity} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MenuLayout>
    );
});

export default Main;
