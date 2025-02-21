import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useDisciplines } from "@/scripts/hooks/useDisciplinesQueries";
import AnimatedLoader from "@/components/elements/AnimatedLoader";

const disciplineTypesNames = {
    lecture: "Лекция",
    practice: "Практика",
    lab: "Лабораторная работа",
    seminar: "Семинар",
};

export default function TeacherDisciplinesModal({
    isOpen,
    onClose,
    onSubmit,
    isLoading,
    teacher,
    initialDisciplines = [],
}) {
    const { data: allDisciplines, isLoading: isDisciplinesLoading } =
        useDisciplines();
    const [selectedDisciplines, setSelectedDisciplines] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (isOpen && teacher?.disciplines?.length) {
            const existingDisciplines = teacher.disciplines.map(
                (discipline) => ({
                    ...discipline,
                    types: discipline.types || [],
                })
            );
            setSelectedDisciplines(existingDisciplines);
        } else {
            setSelectedDisciplines([]);
        }
    }, [isOpen, teacher]);

    if (!isOpen) return null;

    const filteredDisciplines =
        allDisciplines?.filter(
            (discipline) =>
                discipline.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                discipline.code
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
        ) || [];

    const handleDisciplineToggle = (discipline) => {
        const existing = selectedDisciplines.find(
            (d) => d.id === discipline.id
        );
        if (existing) {
            setSelectedDisciplines(
                selectedDisciplines.filter((d) => d.id !== discipline.id)
            );
        } else {
            setSelectedDisciplines([
                ...selectedDisciplines,
                {
                    id: discipline.id,
                    name: discipline.name,
                    code: discipline.code,
                    types: [],
                },
            ]);
        }
    };

    const handleTypeToggle = (disciplineId, type) => {
        setSelectedDisciplines(
            selectedDisciplines.map((discipline) => {
                if (discipline.id === disciplineId) {
                    const types = discipline.types || [];
                    return {
                        ...discipline,
                        types: types.includes(type)
                            ? types.filter((t) => t !== type)
                            : [...types, type],
                    };
                }
                return discipline;
            })
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(selectedDisciplines);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-4xl max-h-[90vh] shadow-xl overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800">
                            Дисциплины преподавателя
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {teacher?.name || teacher?.email}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <Icon icon="mdi:close" className="text-2xl" />
                    </button>
                </div>

                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Поиск по названию или коду..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-400"
                    />
                    <Icon
                        icon="mdi:magnify"
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
                    />
                </div>

                <div className="flex-1 overflow-y-auto">
                    {isDisciplinesLoading ? (
                        <div className="flex justify-center py-12">
                            <AnimatedLoader className="w-8 h-8" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredDisciplines.map((discipline) => {
                                const isSelected = selectedDisciplines.some(
                                    (d) => d.id === discipline.id
                                );
                                const selectedDiscipline =
                                    selectedDisciplines.find(
                                        (d) => d.id === discipline.id
                                    );

                                return (
                                    <div
                                        key={discipline.id}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() =>
                                            handleDisciplineToggle(discipline)
                                        }
                                        onKeyDown={(e) => {
                                            if (
                                                e.key === "Enter" ||
                                                e.key === " "
                                            ) {
                                                handleDisciplineToggle(
                                                    discipline
                                                );
                                            }
                                        }}
                                        className={`p-4 rounded-lg border cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-purple-200 ${
                                            isSelected
                                                ? "border-purple-200 bg-purple-50"
                                                : "border-gray-200 hover:border-purple-200 hover:bg-purple-50/50"
                                        } transition-all`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    handleDisciplineToggle(
                                                        discipline
                                                    );
                                                }}
                                                className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                                            />
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <code className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm font-mono">
                                                        {discipline.code}
                                                    </code>
                                                    <h3 className="font-medium text-gray-900">
                                                        {discipline.name}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>

                                        {isSelected && (
                                            <div
                                                className="mt-4 pl-7"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <p className="text-sm text-gray-600 mb-2">
                                                    Выберите типы занятий:
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {discipline.types.map(
                                                        (type) => (
                                                            <button
                                                                key={type}
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    handleTypeToggle(
                                                                        discipline.id,
                                                                        type
                                                                    );
                                                                }}
                                                                className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                                                                    selectedDiscipline?.types?.includes(
                                                                        type
                                                                    )
                                                                        ? "bg-purple-100 text-purple-700 border-2 border-purple-200"
                                                                        : "bg-gray-50 text-gray-700 border-2 border-gray-100 hover:bg-gray-100"
                                                                }`}
                                                            >
                                                                {
                                                                    disciplineTypesNames[
                                                                        type
                                                                    ]
                                                                }
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-4 mt-4 border-t">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || selectedDisciplines.length === 0}
                        className="px-6 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
            </div>
        </div>
    );
}
