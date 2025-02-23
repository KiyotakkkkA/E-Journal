import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

export default function AddLessonModal({
    timeSlot,
    group,
    dayOfWeek,
    weekType,
    teachers = [],
    auditoriums = [],
    onClose,
    onSubmit,
    isLoading,
}) {
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [selectedAuditorium, setSelectedAuditorium] = useState(null);
    const [selectedLessonType, setSelectedLessonType] = useState(null);
    const [errors, setErrors] = useState({});
    const [searchTeacher, setSearchTeacher] = useState("");
    const [searchAuditorium, setSearchAuditorium] = useState("");
    const [showTeacherOptions, setShowTeacherOptions] = useState(false);
    const [showAuditoriumOptions, setShowAuditoriumOptions] = useState(false);

    const AUDITORIUM_TYPES = {
        regular: { name: "Обычная" },
        lecture: { name: "Лекционная" },
        computer: { name: "Компьютерный класс" },
        laboratory: { name: "Лаборатория" },
        conference: { name: "Конференц-зал" },
    };

    const LESSON_TYPES = {
        lecture: { name: "Лекция", icon: "mdi:presentation" },
        practice: { name: "Практика", icon: "mdi:pencil" },
        laboratory: { name: "Лабораторная", icon: "mdi:test-tube" },
        seminar: { name: "Семинар", icon: "mdi:account-group" },
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!selectedTeacher) newErrors.teacher = "Выберите преподавателя";
        if (!selectedLesson) newErrors.discipline = "Выберите дисциплину";
        if (!selectedLessonType) newErrors.lessonType = "Выберите тип занятия";
        if (!selectedAuditorium) newErrors.auditorium = "Выберите аудиторию";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit({
            group_id: group.id,
            teacher_id: selectedTeacher.id,
            discipline_id: selectedLesson.id,
            lesson_type: selectedLessonType,
            auditorium_id: selectedAuditorium.id,
            day_of_week: dayOfWeek,
            week_type: weekType,
            start_time: timeSlot.start,
            end_time: timeSlot.end,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-2xl shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Добавить занятие
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <Icon icon="mdi:close" className="text-2xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-4">
                            <div>
                                <div className="text-sm text-gray-500">
                                    Время
                                </div>
                                <div className="text-lg font-semibold text-gray-900">
                                    {timeSlot.start} - {timeSlot.end}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">
                                    Группа
                                </div>
                                <div className="text-lg font-semibold text-gray-900">
                                    {group.name}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Преподаватель
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Поиск преподавателя..."
                                value={searchTeacher}
                                onChange={(e) => {
                                    setSearchTeacher(e.target.value);
                                    setShowTeacherOptions(true);
                                }}
                                onFocus={() => setShowTeacherOptions(true)}
                                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200
                                    rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500
                                    focus:border-transparent transition-all duration-200
                                    placeholder:text-gray-400"
                            />
                            <Icon
                                icon="mdi:magnify"
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
                            />
                            {showTeacherOptions && searchTeacher && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                    {teachers
                                        ?.filter((teacher) => {
                                            const teacherName =
                                                teacher?.name?.toLowerCase() ||
                                                "";
                                            const searchValue =
                                                searchTeacher.toLowerCase();
                                            return teacherName.includes(
                                                searchValue
                                            );
                                        })
                                        .map((teacher) => (
                                            <button
                                                key={teacher.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedTeacher(teacher);
                                                    setSearchTeacher(
                                                        teacher?.name || ""
                                                    );
                                                    setSelectedLesson(null);
                                                    setShowTeacherOptions(
                                                        false
                                                    );
                                                }}
                                                className="w-full px-4 py-2 text-left hover:bg-purple-50 flex items-center gap-3"
                                            >
                                                <Icon
                                                    icon="mdi:account-tie"
                                                    className="text-gray-400"
                                                />
                                                <div>
                                                    <div className="font-medium">
                                                        {teacher?.name}
                                                    </div>
                                                    {teacher.disciplines
                                                        ?.length > 0 && (
                                                        <div className="text-sm text-gray-500">
                                                            {
                                                                teacher
                                                                    .disciplines[0]
                                                                    ?.name
                                                            }
                                                            {teacher.disciplines
                                                                .length > 1 &&
                                                                ` +${
                                                                    teacher
                                                                        .disciplines
                                                                        .length -
                                                                    1
                                                                }`}
                                                        </div>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                </div>
                            )}
                        </div>
                        {errors.teacher && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.teacher}
                            </p>
                        )}
                    </div>

                    {selectedTeacher && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Дисциплина
                            </label>
                            <div className="grid grid-cols-1 gap-2">
                                {selectedTeacher.disciplines?.map(
                                    (discipline) => (
                                        <button
                                            key={discipline.id}
                                            type="button"
                                            onClick={() =>
                                                setSelectedLesson(discipline)
                                            }
                                            className={`p-3 rounded-lg text-left transition-all ${
                                                selectedLesson?.id ===
                                                discipline.id
                                                    ? "bg-purple-100 border-purple-200 border-2"
                                                    : "bg-gray-50 border border-gray-200 hover:border-purple-200"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`p-2 rounded-lg ${
                                                        selectedLesson?.id ===
                                                        discipline.id
                                                            ? "bg-purple-200"
                                                            : "bg-white"
                                                    }`}
                                                >
                                                    <Icon
                                                        icon={
                                                            LESSON_TYPES[
                                                                discipline.type
                                                            ]?.icon ||
                                                            "mdi:book"
                                                        }
                                                        className={`text-xl ${
                                                            selectedLesson?.id ===
                                                            discipline.id
                                                                ? "text-purple-600"
                                                                : "text-gray-500"
                                                        }`}
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {discipline.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {LESSON_TYPES[
                                                            discipline.type
                                                        ]?.name ||
                                                            discipline.type}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    )
                                )}
                            </div>
                            {errors.discipline && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.discipline}
                                </p>
                            )}
                        </div>
                    )}

                    {selectedTeacher && selectedLesson && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Тип занятия
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {selectedLesson.types?.map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => {
                                            setSelectedLessonType(type);
                                        }}
                                        className={`p-3 rounded-lg text-left transition-all ${
                                            selectedLessonType === type
                                                ? "bg-purple-100 border-purple-200 border-2"
                                                : "bg-gray-50 border border-gray-200 hover:border-purple-200"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`p-2 rounded-lg ${
                                                    selectedLessonType === type
                                                        ? "bg-purple-200"
                                                        : "bg-white"
                                                }`}
                                            >
                                                <Icon
                                                    icon={
                                                        LESSON_TYPES[type]?.icon
                                                    }
                                                    className={`text-xl ${
                                                        selectedLessonType ===
                                                        type
                                                            ? "text-purple-600"
                                                            : "text-gray-500"
                                                    }`}
                                                />
                                            </div>
                                            <div className="font-medium text-gray-900">
                                                {LESSON_TYPES[type]?.name}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            {errors.lessonType && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.lessonType}
                                </p>
                            )}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Аудитория
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Поиск аудитории..."
                                value={searchAuditorium}
                                onChange={(e) => {
                                    setSearchAuditorium(e.target.value);
                                    setShowAuditoriumOptions(true);
                                }}
                                onFocus={() => setShowAuditoriumOptions(true)}
                                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200
                                    rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500
                                    focus:border-transparent transition-all duration-200
                                    placeholder:text-gray-400"
                            />
                            <Icon
                                icon="mdi:magnify"
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
                            />
                            {showAuditoriumOptions && searchAuditorium && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                    {auditoriums
                                        ?.filter((auditorium) =>
                                            auditorium.number
                                                .toLowerCase()
                                                .includes(
                                                    searchAuditorium.toLowerCase()
                                                )
                                        )
                                        .map((auditorium) => (
                                            <button
                                                key={auditorium.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedAuditorium(
                                                        auditorium
                                                    );
                                                    setSearchAuditorium(
                                                        auditorium.number
                                                    );
                                                    setShowAuditoriumOptions(
                                                        false
                                                    );
                                                }}
                                                className="w-full px-4 py-2 text-left hover:bg-purple-50 flex items-center gap-3"
                                            >
                                                <Icon
                                                    icon="mdi:door"
                                                    className="text-gray-400"
                                                />
                                                <div>
                                                    <div className="font-medium">
                                                        Аудитория{" "}
                                                        {auditorium.number}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {AUDITORIUM_TYPES[
                                                            auditorium.type
                                                        ]?.name ||
                                                            auditorium.type}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                </div>
                            )}
                        </div>
                        {errors.auditorium && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.auditorium}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100
                                rounded-lg hover:bg-gray-200 transition-all"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2.5 text-sm font-medium text-white bg-purple-600
                                rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2
                                focus:ring-purple-200 disabled:opacity-50 disabled:cursor-not-allowed
                                transition-all"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <Icon
                                        icon="mdi:loading"
                                        className="animate-spin"
                                    />
                                    Сохранение...
                                </div>
                            ) : (
                                "Сохранить"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
