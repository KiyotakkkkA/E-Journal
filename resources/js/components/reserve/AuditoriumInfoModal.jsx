import React from "react";
import { Icon } from "@iconify/react";
import { getAuditoriumType } from "../../scripts/utils/auditoriumUtils";

const EQUIPMENT_ICONS = {
    has_projector: { icon: "mdi:projector", label: "Проектор" },
    has_internet: { icon: "mdi:wifi", label: "Интернет" },
};

export default function AuditoriumInfoModal({ auditorium, onClose }) {
    if (!auditorium) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900">
                            Аудитория {auditorium.number}
                        </h2>
                        <p className="text-gray-600">
                            {getAuditoriumType(auditorium.type)}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Icon
                            icon="mdi:close"
                            className="text-2xl text-gray-500"
                        />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-700">
                        <Icon icon="mdi:account-group" className="text-xl" />
                        <span>Вместимость: {auditorium.capacity} мест</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                        <Icon icon="mdi:stairs" className="text-xl" />
                        <span>Этаж: {auditorium.floor}</span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {Object.entries(EQUIPMENT_ICONS).map(
                            ([key, { icon, label }]) =>
                                auditorium[key] && (
                                    <div
                                        key={key}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm"
                                    >
                                        <Icon icon={icon} className="text-lg" />
                                        <span>{label}</span>
                                    </div>
                                )
                        )}
                    </div>

                    {auditorium.description && (
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-1">
                                Дополнительная информация
                            </h3>
                            <p className="text-gray-600 text-sm">
                                {auditorium.description}
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
}
