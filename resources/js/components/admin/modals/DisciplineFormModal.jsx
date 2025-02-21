import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

export default function DisciplineFormModal({
    discipline = null,
    isOpen,
    onClose,
    onSubmit,
    isLoading,
}) {
    const [formData, setFormData] = useState({
        code: discipline?.code || "",
        name: discipline?.name || "",
        types: discipline?.types || [],
    });
    const [errors, setErrors] = useState({});

    const lessonTypes = [
        { id: "lecture", label: "Лекция" },
        { id: "practice", label: "Практика" },
        { id: "lab", label: "Лабораторная" },
        { id: "seminar", label: "Семинар" },
    ];

    useEffect(() => {
        if (discipline) {
            setFormData({
                code: discipline.code,
                name: discipline.name,
                types: discipline.types,
            });
        }
    }, [discipline]);

    const handleTypeToggle = (typeId) => {
        setFormData((prev) => ({
            ...prev,
            types: prev.types.includes(typeId)
                ? prev.types.filter((t) => t !== typeId)
                : [...prev.types, typeId],
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        const newErrors = {};
        if (!formData.code.trim()) newErrors.code = "Код дисциплины обязателен";
        if (!formData.name.trim())
            newErrors.name = "Название дисциплины обязательно";
        if (formData.types.length === 0)
            newErrors.types = "Выберите хотя бы один тип занятия";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        {discipline
                            ? "Редактировать дисциплину"
                            : "Добавить дисциплину"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <Icon icon="mdi:close" className="text-2xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Код дисциплины
                        </label>
                        <input
                            type="text"
                            value={formData.code}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    code: e.target.value,
                                }))
                            }
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all
                                ${
                                    errors.code
                                        ? "border-red-300 focus:ring-red-100 focus:border-red-400"
                                        : "border-gray-300 focus:ring-purple-100 focus:border-purple-400"
                                }`}
                            placeholder="Например: МАТ.01"
                        />
                        {errors.code && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.code}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Название дисциплины
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }))
                            }
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all
                                ${
                                    errors.name
                                        ? "border-red-300 focus:ring-red-100 focus:border-red-400"
                                        : "border-gray-300 focus:ring-purple-100 focus:border-purple-400"
                                }`}
                            placeholder="Например: Высшая математика"
                        />
                        {errors.name && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Типы занятий
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {lessonTypes.map((type) => (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => handleTypeToggle(type.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                                        ${
                                            formData.types.includes(type.id)
                                                ? "bg-purple-100 text-purple-700 border-2 border-purple-200"
                                                : "bg-gray-50 text-gray-700 border-2 border-gray-100 hover:bg-gray-100"
                                        }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                        {errors.types && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.types}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
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
                </form>
            </div>
        </div>
    );
}
