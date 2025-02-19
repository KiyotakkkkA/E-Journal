import { Icon } from "@iconify/react";
import React, { useState } from "react";

const RequestCard = ({ request, status }) => {
    const statusConfig = {
        pending: {
            icon: "mdi:clock-outline",
            color: "text-yellow-600",
            text: "В обработке",
            bgColor: "bg-yellow-50",
        },
        approved: {
            icon: "mdi:check-circle-outline",
            color: "text-green-600",
            text: "Одобрено",
            bgColor: "bg-green-50",
        },
        rejected: {
            icon: "mdi:close-circle-outline",
            color: "text-red-600",
            text: "Отклонено",
            bgColor: "bg-red-50",
        },
        group_deleted: {
            icon: "mdi:trash-can-outline",
            color: "text-red-600",
            text: "Группа удалена",
            bgColor: "bg-red-50",
        },
    };

    const config = statusConfig[status];

    return (
        <div className={`p-4 rounded-lg ${config.bgColor} mr-3`}>
            <div className="flex justify-between items-start mb-3 gap-2">
                <h6 className="text-sm font-medium text-gray-600">
                    Заявка на зачисление
                </h6>
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${config.bgColor} ${config.color}`}
                >
                    <Icon icon={config.icon} className="mr-1" />
                    {config.text}
                </span>
            </div>
            <div className="mb-2 text-sm">
                <span className="font-medium">ФИО: </span>
                {request.name}
            </div>
            <div className="text-sm">
                <span className="font-medium">Группа: </span>
                {request.group.name}
            </div>
        </div>
    );
};

const StudentRequests = ({ requests }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    if (!requests || Object.values(requests).every((arr) => arr.length === 0)) {
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
                        icon="mdi:file-document-multiple"
                        className="text-2xl text-gray-600"
                    />
                    <h3 className="text-lg font-semibold text-gray-800">
                        Заявки
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
                    <div className="max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
                        <div className="space-y-6">
                            {Object.entries(requests).map(
                                ([status, requestList]) =>
                                    requestList.length > 0 && (
                                        <div key={status}>
                                            <h5 className="flex items-center space-x-2 text-lg font-medium text-gray-800 mb-4 sticky top-0 bg-white py-2">
                                                <Icon
                                                    icon={
                                                        status === "pending"
                                                            ? "mdi:clock-outline"
                                                            : status ===
                                                              "approved"
                                                            ? "mdi:check-circle"
                                                            : status ===
                                                              "group_deleted"
                                                            ? "mdi:trash-can-outline"
                                                            : "mdi:close-circle"
                                                    }
                                                    className={
                                                        status === "pending"
                                                            ? "text-yellow-600"
                                                            : status ===
                                                              "approved"
                                                            ? "text-green-600"
                                                            : "text-red-600"
                                                    }
                                                />
                                                <span>
                                                    {status === "pending" &&
                                                        "Активные заявки"}
                                                    {status === "approved" &&
                                                        "Одобренные заявки"}
                                                    {status === "rejected" &&
                                                        "Отклоненные заявки"}
                                                    {status ===
                                                        "group_deleted" &&
                                                        "Отменённые заявки"}
                                                </span>
                                            </h5>
                                            <div className="flex flex-wrap gap-3">
                                                {requestList.map((request) => (
                                                    <RequestCard
                                                        key={request.id}
                                                        request={request}
                                                        status={status}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentRequests;
