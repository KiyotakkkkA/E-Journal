import React, { useState } from "react";
import { Icon } from "@iconify/react";

export default function TeachersList({
    activeInstitute,
    activeCafedra,
    onAssignTeacher,
    onRemoveTeacher,
    teachers,
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const hasNoTeachers = !teachers?.length;
    const isDisabled = !activeCafedra;

    const filteredTeachers = teachers?.filter(
        (teacher) =>
            teacher.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            teacher.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div
            className={`bg-white rounded-lg shadow p-6 ${
                isDisabled ? "opacity-60" : ""
            }`}
        >
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Преподаватели
                    </h2>
                    <span className="px-2 py-0.5 text-xs font-medium text-purple-800 bg-purple-50 rounded-full">
                        {teachers?.length || 0}
                    </span>
                </div>
                <button
                    onClick={onAssignTeacher}
                    disabled={isDisabled}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:bg-gray-200 disabled:text-gray-400 transition-all"
                    title={isDisabled ? "Сначала выберите кафедру" : ""}
                >
                    <Icon icon="mdi:account-plus" className="text-lg" />
                    Назначить
                </button>
            </div>

            {activeCafedra && !hasNoTeachers && (
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Поиск по имени или email..."
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Icon
                        icon="mdi:magnify"
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <Icon icon="mdi:close" className="text-lg" />
                        </button>
                    )}
                </div>
            )}

            {!activeInstitute ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Icon
                        icon="mdi:school-outline"
                        className="text-5xl text-gray-300 mb-3 mx-auto"
                    />
                    <p className="text-gray-500 font-medium">
                        Выберите институт
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                        Для просмотра списка преподавателей
                    </p>
                </div>
            ) : !activeCafedra ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Icon
                        icon="mdi:teach"
                        className="text-5xl text-gray-300 mb-3 mx-auto"
                    />
                    <p className="text-gray-500 font-medium">
                        Выберите кафедру
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                        Для управления преподавателями
                    </p>
                </div>
            ) : hasNoTeachers ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Icon
                        icon="mdi:account-school"
                        className="text-5xl text-gray-300 mb-3 mx-auto"
                    />
                    <p className="text-gray-500 font-medium">
                        Нет преподавателей
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                        Назначьте преподавателей на кафедру
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredTeachers.map((teacher) => (
                        <div
                            key={teacher.id}
                            className="group relative bg-white rounded-lg border border-gray-200 hover:border-purple-200 hover:shadow-md transition-all duration-200"
                        >
                            <div className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                                            {teacher.name ? (
                                                <span className="text-lg font-medium text-purple-700">
                                                    {teacher.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </span>
                                            ) : (
                                                <Icon
                                                    icon="mdi:account"
                                                    className="text-2xl text-purple-600"
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">
                                                {teacher.name || "Без имени"}
                                            </h3>
                                            <div className="text-sm text-gray-500 flex items-center gap-1.5">
                                                <Icon
                                                    icon="mdi:email"
                                                    className="text-base"
                                                />
                                                {teacher.email}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onRemoveTeacher(teacher)}
                                        className="hidden group-hover:flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                                        title="Открепить от кафедры"
                                    >
                                        <Icon
                                            icon="mdi:link-off"
                                            className="text-base"
                                        />
                                        <span>Открепить</span>
                                    </button>
                                </div>
                                <div className="flex items-center flex-wrap gap-2 mt-3">
                                    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-sm">
                                        <Icon
                                            icon="mdi:school"
                                            className="text-base"
                                        />
                                        <span>Преподаватель</span>
                                    </div>
                                    {teacher.email_verified_at && (
                                        <>
                                            <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-700 rounded-md text-sm">
                                                <Icon
                                                    icon="mdi:check-circle"
                                                    className="text-base"
                                                />
                                                <span>Подтвержден</span>
                                            </div>
                                            <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-50 text-gray-600 rounded-md text-sm">
                                                <Icon
                                                    icon="mdi:clock-outline"
                                                    className="text-base"
                                                />
                                                <span className="whitespace-nowrap">
                                                    {new Date(
                                                        teacher.email_verified_at
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {searchQuery && filteredTeachers.length === 0 && (
                        <div className="text-center py-8">
                            <Icon
                                icon="mdi:search-off"
                                className="text-4xl text-gray-300 mb-2 mx-auto"
                            />
                            <p className="text-gray-500">Ничего не найдено</p>
                            <button
                                onClick={() => setSearchQuery("")}
                                className="text-sm text-purple-600 hover:text-purple-700 mt-2"
                            >
                                Сбросить поиск
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
