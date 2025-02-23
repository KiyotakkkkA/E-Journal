import React from "react";
import { Icon } from "@iconify/react";

const DAYS_OF_WEEK = [
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
];

export default function DateSelector({ selectedDate, onDateSelect }) {
    const dayOfWeek = DAYS_OF_WEEK[selectedDate.getDay()];
    const formattedDate = selectedDate.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    return (
        <div className="min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата
            </label>
            <div className="relative">
                <input
                    type="date"
                    value={selectedDate.toISOString().split("T")[0]}
                    onChange={(e) => onDateSelect(new Date(e.target.value))}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <Icon
                        icon="mdi:calendar"
                        className="text-xl text-gray-400"
                    />
                </div>
            </div>
            <div className="mt-1 text-sm text-gray-500 flex items-center gap-2">
                <Icon icon="mdi:calendar-week" className="text-base" />
                {dayOfWeek}, {formattedDate}
            </div>
            <div className="mt-2 flex gap-2">
                <button
                    onClick={() => {
                        const prevDay = new Date(selectedDate);
                        prevDay.setDate(prevDay.getDate() - 1);
                        onDateSelect(prevDay);
                    }}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Предыдущий день"
                >
                    <Icon icon="mdi:chevron-left" className="text-xl" />
                </button>
                <button
                    onClick={() => onDateSelect(new Date())}
                    className="flex-1 px-3 py-1 text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                >
                    Сегодня
                </button>
                <button
                    onClick={() => {
                        const nextDay = new Date(selectedDate);
                        nextDay.setDate(nextDay.getDate() + 1);
                        onDateSelect(nextDay);
                    }}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Следующий день"
                >
                    <Icon icon="mdi:chevron-right" className="text-xl" />
                </button>
            </div>
        </div>
    );
}
