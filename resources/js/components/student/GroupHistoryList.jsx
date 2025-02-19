import React, { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Icon } from "@iconify/react";

const statusMessages = {
    created: "Группа создана",
    renamed: "Группа переименована",
    deleted: "Группа удалена",
};

const statusColors = {
    created: "bg-green-50 border-l-4 border-l-green-500",
    renamed: "bg-blue-50 border-l-4 border-l-blue-500",
    deleted: "bg-red-50 border-l-4 border-l-red-500",
};

const textColors = {
    created: "text-green-700",
    renamed: "text-blue-700",
    deleted: "text-red-700",
};

const GroupHistoryList = ({ history }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    if (!history || history.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <button
                className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 rounded-t-lg hover:bg-gray-100 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center space-x-2">
                    <Icon
                        icon="mdi:history"
                        className="text-2xl text-gray-600"
                    />
                    <h3 className="text-lg font-semibold text-gray-800">
                        История группы
                    </h3>
                </div>
                <Icon
                    icon="mdi:chevron-down"
                    className={`text-2xl text-gray-600 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                    }`}
                />
            </button>

            <div
                className={`overflow-hidden transition-all duration-200 ${
                    isExpanded
                        ? "max-h-[500px] opacity-100"
                        : "max-h-0 opacity-0"
                }`}
            >
                <div className="p-6">
                    <div className="relative">
                        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                        <div className="space-y-4">
                            {history.map((event) => (
                                <div key={event.id} className="relative pl-8">
                                    <div
                                        className={`absolute left-2.5 top-3 w-2.5 h-2.5 rounded-full ${
                                            textColors[event.status]
                                        } bg-white border-2 border-current transform -translate-x-1/2`}
                                    ></div>

                                    <div
                                        className={`p-3 rounded-lg shadow-sm ${
                                            statusColors[event.status]
                                        }`}
                                    >
                                        <p
                                            className={`font-medium ${
                                                textColors[event.status]
                                            }`}
                                        >
                                            {statusMessages[event.status]}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {format(
                                                new Date(event.created_at),
                                                "d MMMM yyyy в HH:mm",
                                                {
                                                    locale: ru,
                                                }
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupHistoryList;
