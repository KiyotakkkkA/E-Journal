import React from "react";
import { Icon } from "@iconify/react";

export default function InstitutesList({
    institutes = [],
    activeInstitute,
    onInstituteSelect,
    onEdit,
    onDelete,
}) {
    const hasNoInstitutes = institutes.length === 0;

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Институты
                    </h2>
                    {hasNoInstitutes ? (
                        <span className="px-2 py-0.5 text-xs font-medium text-yellow-800 bg-yellow-50 rounded-full">
                            Нет институтов
                        </span>
                    ) : (
                        <span className="text-xs text-gray-500">
                            Всего: {institutes.length}
                        </span>
                    )}
                </div>
            </div>

            {hasNoInstitutes ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Icon
                        icon="mdi:domain"
                        className="text-4xl text-gray-300 mb-3 mx-auto"
                    />
                    <p className="text-gray-500">Добавьте первый институт</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {institutes.map((institute) => (
                        <div
                            key={institute.id}
                            onClick={() => onInstituteSelect(institute)}
                            className={`relative overflow-hidden p-4 rounded-lg border group transition-all cursor-pointer ${
                                activeInstitute?.id === institute.id
                                    ? "bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 shadow-sm"
                                    : "bg-white border-gray-200 hover:border-purple-200 hover:bg-purple-50/30"
                            }`}
                        >
                            {activeInstitute?.id === institute.id && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-400" />
                            )}

                            <div className="flex justify-between items-start">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Icon
                                            icon="mdi:domain"
                                            className={`text-xl ${
                                                activeInstitute?.id ===
                                                institute.id
                                                    ? "text-purple-500"
                                                    : "text-gray-400 group-hover:text-purple-400"
                                            }`}
                                        />
                                        <h3 className="font-medium text-gray-900 truncate">
                                            {institute.name}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="flex items-center gap-1 text-gray-500">
                                            <Icon
                                                icon="mdi:school-outline"
                                                className="text-lg"
                                            />
                                            <span>
                                                {institute.count_cafedras || 0}{" "}
                                                кафедр
                                            </span>
                                        </div>
                                        {institute.teachers?.length > 0 && (
                                            <div className="flex items-center gap-1 text-gray-500">
                                                <Icon
                                                    icon="mdi:account-group-outline"
                                                    className="text-lg"
                                                />
                                                <span>
                                                    {institute.teachers.length}{" "}
                                                    преподавателей
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div
                                    className={`flex gap-1 ${
                                        activeInstitute?.id === institute.id
                                            ? "opacity-100"
                                            : "opacity-0 group-hover:opacity-100"
                                    } transition-opacity`}
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(institute);
                                        }}
                                        className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-white rounded-md transition-colors"
                                        title="Редактировать"
                                    >
                                        <Icon
                                            icon="mdi:pencil"
                                            className="text-xl"
                                        />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(institute);
                                        }}
                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-md transition-colors"
                                        title="Удалить"
                                    >
                                        <Icon
                                            icon="mdi:delete"
                                            className="text-xl"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
