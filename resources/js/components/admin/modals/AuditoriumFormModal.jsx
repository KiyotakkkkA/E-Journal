import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

const AUDITORIUM_TYPES = [
    { id: "regular", name: "Обычная", icon: "mdi:desk" },
    { id: "lecture", name: "Лекционная", icon: "mdi:presentation" },
    { id: "computer", name: "Компьютерный класс", icon: "mdi:desktop-classic" },
    { id: "laboratory", name: "Лаборатория", icon: "mdi:test-tube" },
    { id: "conference", name: "Конференц-зал", icon: "mdi:account-group" },
];

const EQUIPMENT_OPTIONS = [
    "Интерактивная доска",
    "Компьютеры",
    "Лабораторное оборудование",
    "Аудиосистема",
    "Видеокамера",
];

export default function AuditoriumFormModal({
    auditorium = null,
    onClose,
    onSubmit,
    isLoading,
}) {
    const [formData, setFormData] = useState({
        number: "",
        name: "",
        type: "regular",
        capacity: "",
        equipment: [],
        has_projector: false,
        has_internet: false,
        description: "",
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (auditorium) {
            setFormData({
                number: auditorium.number,
                name: auditorium.name || "",
                type: auditorium.type,
                capacity: auditorium.capacity,
                equipment: auditorium.equipment || [],
                has_projector: auditorium.has_projector,
                has_internet: auditorium.has_internet,
                description: auditorium.description || "",
            });
        }
    }, [auditorium]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.number.trim()) {
            newErrors.number = "Номер аудитории обязателен";
        }
        if (!formData.capacity || formData.capacity < 1) {
            newErrors.capacity = "Укажите корректную вместимость";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit(formData);
    };

    const toggleEquipment = (item) => {
        setFormData((prev) => ({
            ...prev,
            equipment: prev.equipment.includes(item)
                ? prev.equipment.filter((i) => i !== item)
                : [...prev.equipment, item],
        }));
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        {auditorium
                            ? "Редактировать аудиторию"
                            : "Добавить аудиторию"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <Icon icon="mdi:close" className="text-2xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Номер аудитории *
                            </label>
                            <input
                                type="text"
                                value={formData.number}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        number: e.target.value,
                                    }))
                                }
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Например: 301"
                            />
                            {errors.number && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.number}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Название (необязательно)
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
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Например: Лекционный зал"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Тип аудитории
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {AUDITORIUM_TYPES.map((type) => (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            type: type.id,
                                        }))
                                    }
                                    className={`flex items-center gap-2 p-3 rounded-lg border transition-all
                                        ${
                                            formData.type === type.id
                                                ? "border-purple-500 bg-purple-50 text-purple-700"
                                                : "border-gray-200 hover:border-purple-200"
                                        }`}
                                >
                                    <Icon
                                        icon={type.icon}
                                        className="text-xl"
                                    />
                                    <span>{type.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Вместимость *
                        </label>
                        <input
                            type="number"
                            value={formData.capacity}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    capacity: parseInt(e.target.value) || "",
                                }))
                            }
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Количество мест"
                            min="1"
                        />
                        {errors.capacity && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.capacity}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Оборудование
                        </label>
                        <div className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                                {EQUIPMENT_OPTIONS.map((item) => (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() => toggleEquipment(item)}
                                        className={`px-3 py-1 rounded-full text-sm transition-all
                                            ${
                                                formData.equipment.includes(
                                                    item
                                                )
                                                    ? "bg-purple-100 text-purple-700"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.has_projector}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                has_projector: e.target.checked,
                                            }))
                                        }
                                        className="rounded text-purple-600 focus:ring-purple-500"
                                    />
                                    <span className="text-sm text-gray-700">
                                        Проектор
                                    </span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.has_internet}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                has_internet: e.target.checked,
                                            }))
                                        }
                                        className="rounded text-purple-600 focus:ring-purple-500"
                                    />
                                    <span className="text-sm text-gray-700">
                                        Интернет
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Описание
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                }))
                            }
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            rows="3"
                            placeholder="Дополнительная информация об аудитории"
                        />
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
                            className="px-6 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-lg
                                hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-200
                                disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
