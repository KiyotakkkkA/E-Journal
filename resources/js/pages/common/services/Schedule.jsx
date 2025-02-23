import React, { useState } from "react";
import MenuLayout from "@/layouts/MenuLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useSchedule } from "@/scripts/hooks/useScheduleQueries";
import AnimatedLoader from "@/components/elements/AnimatedLoader";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
const DAYS_OF_WEEK = [
    { id: "monday", name: "Понедельник" },
    { id: "tuesday", name: "Вторник" },
    { id: "wednesday", name: "Среда" },
    { id: "thursday", name: "Четверг" },
    { id: "friday", name: "Пятница" },
    { id: "saturday", name: "Суббота" },
];

const TIME_SLOTS = ["09:00:00", "10:40:00", "12:40:00", "14:20:00", "16:00:00"];

const LESSON_TYPES = {
    lecture: {
        name: "Лекция",
        icon: "mdi:presentation",
        color: "text-blue-600",
    },
    practice: {
        name: "Практика",
        icon: "mdi:pencil",
        color: "text-green-600",
    },
    laboratory: {
        name: "Лабораторная",
        icon: "mdi:test-tube",
        color: "text-purple-600",
    },
    seminar: {
        name: "Семинар",
        icon: "mdi:account-group",
        color: "text-orange-600",
    },
};

export default function Schedule() {
    const { roles, group } = useAuth();
    const [selectedDay, setSelectedDay] = useState("all");
    const [selectedGroup, setSelectedGroup] = useState("all");
    const [selectedWeekType, setSelectedWeekType] = useState("all");
    const { data: scheduleData, isLoading } = useSchedule(
        roles.isStudent ? group?.id : null,
        selectedDay,
        selectedWeekType,
        roles.isTeacher
    );

    if (isLoading) {
        return (
            <MenuLayout>
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-8">
                            Расписание
                        </h1>
                        <Link
                            to="/services"
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

                    <div className="flex justify-center items-center h-64">
                        <AnimatedLoader className="w-16 h-16" />
                    </div>
                </div>
            </MenuLayout>
        );
    }

    if (!scheduleData && !isLoading) {
        return (
            <MenuLayout>
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-8">
                            Расписание
                        </h1>
                        <Link
                            to="/services"
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
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                        <Icon
                            icon="mdi:calendar-blank"
                            className="text-4xl text-gray-400 mx-auto mb-2"
                        />
                        <p className="text-gray-600">
                            {roles.isStudent
                                ? "Расписание для вашей группы не найдено"
                                : "Расписание не найдено"}
                        </p>
                    </div>
                </div>
            </MenuLayout>
        );
    }

    const renderTeacherSchedule = () => {
        const groups = [
            ...new Set(scheduleData?.map((s) => s.group.name) || []),
        ];

        const filteredSchedule = scheduleData?.filter((schedule) => {
            if (selectedDay !== "all" && schedule.day_of_week !== selectedDay)
                return false;
            if (
                selectedGroup !== "all" &&
                schedule.group.name !== selectedGroup
            )
                return false;
            return true;
        });

        const scheduleByDays = filteredSchedule?.reduce((acc, schedule) => {
            const day = schedule.day_of_week;
            if (!acc[day]) acc[day] = [];
            acc[day].push(schedule);
            return acc;
        }, {});

        return (
            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                День недели
                            </label>
                            <select
                                value={selectedDay}
                                onChange={(e) => setSelectedDay(e.target.value)}
                                className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                            >
                                <option value="all">Все дни</option>
                                {DAYS_OF_WEEK.map((day) => (
                                    <option key={day.id} value={day.id}>
                                        {day.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Группа
                            </label>
                            <select
                                value={selectedGroup}
                                onChange={(e) =>
                                    setSelectedGroup(e.target.value)
                                }
                                className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                            >
                                <option value="all">Все группы</option>
                                {groups.map((group) => (
                                    <option key={group} value={group}>
                                        {group}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {DAYS_OF_WEEK.map((day) => {
                    const daySchedule = scheduleByDays?.[day.id] || [];
                    if (selectedDay !== "all" && selectedDay !== day.id)
                        return null;
                    if (!daySchedule.length) return null;

                    return (
                        <div
                            key={day.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                        >
                            <div className="bg-purple-50 px-6 py-4 border-b border-purple-100">
                                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                    <Icon
                                        icon="mdi:calendar"
                                        className="text-purple-600"
                                    />
                                    {day.name}
                                </h2>
                            </div>
                            <div className="divide-y">
                                {TIME_SLOTS.map((timeSlot) => {
                                    const lessonsAtTime = daySchedule.filter(
                                        (schedule) =>
                                            schedule.start_time === timeSlot
                                    );
                                    if (!lessonsAtTime.length) return null;

                                    return (
                                        <div key={timeSlot} className="p-4">
                                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 border border-purple-100 mb-4">
                                                <Icon
                                                    icon="mdi:clock-outline"
                                                    className="text-purple-600 mr-2"
                                                />
                                                <span className="text-sm font-medium text-purple-900">
                                                    {timeSlot.slice(0, 5)} -{" "}
                                                    {lessonsAtTime[0].end_time.slice(
                                                        0,
                                                        5
                                                    )}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {Object.values(
                                                    lessonsAtTime.reduce(
                                                        (acc, schedule) => {
                                                            const key = `${schedule.lesson.discipline.name}-${schedule.lesson.type}`;
                                                            if (!acc[key]) {
                                                                acc[key] = {
                                                                    discipline:
                                                                        schedule
                                                                            .lesson
                                                                            .discipline,
                                                                    type: schedule
                                                                        .lesson
                                                                        .type,
                                                                    schedules:
                                                                        [],
                                                                };
                                                            }
                                                            acc[
                                                                key
                                                            ].schedules.push(
                                                                schedule
                                                            );
                                                            return acc;
                                                        },
                                                        {}
                                                    )
                                                ).map(
                                                    ({
                                                        discipline,
                                                        type,
                                                        schedules,
                                                    }) => (
                                                        <div
                                                            key={`${discipline.name}-${type}`}
                                                            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-purple-200 transition-all duration-200"
                                                        >
                                                            <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-100">
                                                                <div className="flex items-center gap-2 flex-1">
                                                                    <div
                                                                        className={`p-2 rounded-lg ${LESSON_TYPES[type].color} bg-opacity-10`}
                                                                    >
                                                                        <Icon
                                                                            icon={
                                                                                LESSON_TYPES[
                                                                                    type
                                                                                ]
                                                                                    .icon
                                                                            }
                                                                            className={`text-lg ${LESSON_TYPES[type].color}`}
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="font-medium text-gray-900 leading-tight">
                                                                            {
                                                                                discipline.name
                                                                            }
                                                                        </h3>
                                                                        <span className="text-xs text-gray-500">
                                                                            {
                                                                                LESSON_TYPES[
                                                                                    type
                                                                                ]
                                                                                    .name
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="p-3">
                                                                <div className="space-y-2">
                                                                    {schedules.map(
                                                                        (
                                                                            schedule
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    schedule.id
                                                                                }
                                                                                className={`flex items-center justify-between p-2 rounded-lg ${
                                                                                    schedule.week_type ===
                                                                                    "even"
                                                                                        ? "bg-blue-50"
                                                                                        : schedule.week_type ===
                                                                                          "odd"
                                                                                        ? "bg-green-50"
                                                                                        : "bg-gray-50"
                                                                                }`}
                                                                            >
                                                                                <div className="flex items-center gap-3">
                                                                                    <div className="flex items-center gap-1.5">
                                                                                        <Icon
                                                                                            icon="mdi:account-group"
                                                                                            className="text-gray-500"
                                                                                        />
                                                                                        <span className="text-sm font-medium text-gray-900">
                                                                                            {
                                                                                                schedule
                                                                                                    .group
                                                                                                    .name
                                                                                            }
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-gray-200">
                                                                                        <Icon
                                                                                            icon="mdi:door"
                                                                                            className="text-purple-600"
                                                                                        />
                                                                                        <span className="text-sm font-medium text-gray-900">
                                                                                            {
                                                                                                schedule
                                                                                                    .auditorium
                                                                                                    .number
                                                                                            }
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                                {schedule.week_type !==
                                                                                    "all" && (
                                                                                    <span
                                                                                        className={`text-xs px-2 py-1 rounded-md ${
                                                                                            schedule.week_type ===
                                                                                            "even"
                                                                                                ? "bg-blue-100 text-blue-700"
                                                                                                : "bg-green-100 text-green-700"
                                                                                        }`}
                                                                                    >
                                                                                        {schedule.week_type ===
                                                                                        "even"
                                                                                            ? "Чётная"
                                                                                            : "Нечётная"}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderStudentSchedule = () => {
        const scheduleByDays = scheduleData?.reduce((acc, schedule) => {
            const day = schedule.day_of_week;
            if (!acc[day]) acc[day] = [];
            acc[day].push(schedule);
            return acc;
        }, {});

        return (
            <div className="space-y-6">
                {DAYS_OF_WEEK.map((day) => {
                    const daySchedule = scheduleByDays?.[day.id] || [];
                    if (!daySchedule.length) return null;

                    return (
                        <div
                            key={day.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                        >
                            <div className="bg-purple-50 px-6 py-4 border-b border-purple-100">
                                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                    <Icon
                                        icon="mdi:calendar"
                                        className="text-purple-600"
                                    />
                                    {day.name}
                                </h2>
                            </div>
                            <div className="divide-y">
                                {TIME_SLOTS.map((timeSlot) => {
                                    const lessonsAtTime = daySchedule.filter(
                                        (schedule) =>
                                            schedule.start_time === timeSlot
                                    );
                                    if (!lessonsAtTime.length) return null;

                                    return (
                                        <div key={timeSlot} className="p-4">
                                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 border border-purple-100 mb-4">
                                                <Icon
                                                    icon="mdi:clock-outline"
                                                    className="text-purple-600 mr-2"
                                                />
                                                <span className="text-sm font-medium text-purple-900">
                                                    {timeSlot.slice(0, 5)} -{" "}
                                                    {lessonsAtTime[0].end_time.slice(
                                                        0,
                                                        5
                                                    )}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4">
                                                {lessonsAtTime.map(
                                                    (schedule) => (
                                                        <div
                                                            key={schedule.id}
                                                            className={`bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-purple-200 transition-all duration-200 ${
                                                                schedule.week_type ===
                                                                "even"
                                                                    ? "bg-blue-50 border-blue-200"
                                                                    : schedule.week_type ===
                                                                      "odd"
                                                                    ? "bg-green-50 border-green-200"
                                                                    : ""
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-100">
                                                                <div className="flex items-center gap-2 flex-1">
                                                                    <div
                                                                        className={`p-2 rounded-lg ${
                                                                            LESSON_TYPES[
                                                                                schedule
                                                                                    .lesson
                                                                                    .type
                                                                            ]
                                                                                .color
                                                                        } bg-opacity-10`}
                                                                    >
                                                                        <Icon
                                                                            icon={
                                                                                LESSON_TYPES[
                                                                                    schedule
                                                                                        .lesson
                                                                                        .type
                                                                                ]
                                                                                    .icon
                                                                            }
                                                                            className={`text-lg ${
                                                                                LESSON_TYPES[
                                                                                    schedule
                                                                                        .lesson
                                                                                        .type
                                                                                ]
                                                                                    .color
                                                                            }`}
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="font-medium text-gray-900 leading-tight">
                                                                            {
                                                                                schedule
                                                                                    .lesson
                                                                                    .discipline
                                                                                    .name
                                                                            }
                                                                        </h3>
                                                                        <span className="text-xs text-gray-500">
                                                                            {
                                                                                LESSON_TYPES[
                                                                                    schedule
                                                                                        .lesson
                                                                                        .type
                                                                                ]
                                                                                    .name
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                {schedule.week_type !==
                                                                    "all" && (
                                                                    <span
                                                                        className={`text-xs px-2 py-1 rounded-md ${
                                                                            schedule.week_type ===
                                                                            "even"
                                                                                ? "bg-blue-100 text-blue-700"
                                                                                : "bg-green-100 text-green-700"
                                                                        }`}
                                                                    >
                                                                        {schedule.week_type ===
                                                                        "even"
                                                                            ? "Чётная"
                                                                            : "Нечётная"}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <div className="p-3">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="flex items-center gap-1.5">
                                                                            <Icon
                                                                                icon="mdi:account-tie"
                                                                                className="text-gray-500"
                                                                            />
                                                                            <span className="text-sm font-medium text-gray-900">
                                                                                {
                                                                                    schedule
                                                                                        .teacher
                                                                                        .user
                                                                                        .name
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-gray-200">
                                                                            <Icon
                                                                                icon="mdi:door"
                                                                                className="text-purple-600"
                                                                            />
                                                                            <span className="text-sm font-medium text-gray-900">
                                                                                {
                                                                                    schedule
                                                                                        .auditorium
                                                                                        .number
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <MenuLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-8">
                        Расписание
                    </h1>
                    <Link
                        to="/services"
                        className="text-gray-500 hover:text-gray-600
                                    transition-all duration-200 transform
                                    hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center
                                    bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                        >
                            <Icon icon="mdi:arrow-left" className="text-xl" />
                        </div>
                    </Link>
                </div>
                {roles.isTeacher
                    ? renderTeacherSchedule()
                    : renderStudentSchedule()}
            </div>
        </MenuLayout>
    );
}
