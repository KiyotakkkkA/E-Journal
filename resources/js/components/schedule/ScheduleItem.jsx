import React from "react";
import { Icon } from "@iconify/react";

const LESSON_TYPES = {
    lecture: {
        name: "Лекция",
        icon: "mdi:presentation",
        color: "bg-blue-100 text-blue-700",
    },
    practice: {
        name: "Практика",
        icon: "mdi:pencil",
        color: "bg-green-100 text-green-700",
    },
    laboratory: {
        name: "Лабораторная",
        icon: "mdi:test-tube",
        color: "bg-purple-100 text-purple-700",
    },
    seminar: {
        name: "Семинар",
        icon: "mdi:account-group",
        color: "bg-orange-100 text-orange-700",
    },
};

export default function ScheduleItem({ schedule, onEdit, onDelete }) {
    const lessonType = LESSON_TYPES[schedule.lesson.type];
    const weekType =
        schedule.week_type === "all"
            ? null
            : schedule.week_type === "even"
            ? "Чётная неделя"
            : "Нечётная неделя";

    return (
        <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {schedule.lesson.discipline.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span
                            className={`px-3 py-1 rounded-full text-sm ${lessonType.color}`}
                        >
                            <div className="flex items-center gap-1">
                                <Icon
                                    icon={lessonType.icon}
                                    className="text-base"
                                />
                                {lessonType.name}
                            </div>
                        </span>
                        {weekType && (
                            <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
                                {weekType}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(schedule)}
                        className="p-1.5 text-gray-400 hover:text-purple-600 transition-colors"
                    >
                        <Icon icon="mdi:pencil" className="text-xl" />
                    </button>
                    <button
                        onClick={() => onDelete(schedule)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                    >
                        <Icon icon="mdi:delete" className="text-xl" />
                    </button>
                </div>
            </div>

            <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Icon icon="mdi:account-tie" className="text-lg" />
                    {schedule.teacher.user.name}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Icon icon="mdi:door" className="text-lg" />
                    Аудитория {schedule.auditorium.number}
                </div>
            </div>
        </div>
    );
}
