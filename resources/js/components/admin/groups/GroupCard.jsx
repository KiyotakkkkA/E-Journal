import React, { useState } from "react";
import GroupDropdown from "./GroupDropdown";
import { Icon } from "@iconify/react";
import { useGroupStudents } from "../../../scripts/hooks/useGroupsQueries";
import GroupStudentsModal from "./GroupStudentsModal";

const GroupCard = ({ group }) => {
    const {
        mutate: fetchStudents,
        data: students,
        isPending,
    } = useGroupStudents(group.id);

    const [showStudentsModal, setShowStudentsModal] = useState(false);
    const [operation, setOperation] = useState(null);

    const handleShowStudents = () => {
        fetchStudents();
        setShowStudentsModal(true);
    };

    const getCardStyle = () => {
        if (operation === "deleting") {
            return "bg-red-50 border-red-100";
        }
        if (operation === "editing") {
            return "bg-green-50 border-green-100";
        }
        if (isPending) {
            return "opacity-70 pointer-events-none";
        }
        return "";
    };

    const getOperationText = () => {
        if (operation === "deleting") return "Удаление...";
        if (operation === "editing") return "Редактирование...";
        return null;
    };

    return (
        <div
            className={`
                bg-white rounded-xl shadow-sm border border-gray-100
                hover:shadow-md transition-all duration-200
                ${getCardStyle()}
                relative
            `}
        >
            {operation && (
                <div
                    className={`
                        absolute inset-0 rounded-xl flex items-center justify-center
                        bg-opacity-50 backdrop-blur-sm
                        ${
                            operation === "deleting"
                                ? "bg-red-100"
                                : "bg-green-100"
                        }
                    `}
                >
                    <div
                        className={`
                            px-4 py-2 rounded-lg
                            ${
                                operation === "deleting"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-green-100 text-green-700"
                            }
                        `}
                    >
                        <span className="text-lg font-medium">
                            {getOperationText()}
                        </span>
                    </div>
                </div>
            )}
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">
                            {group.name}
                        </h3>
                        <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                            <Icon icon="mdi:account-group" />
                            <span>
                                {group.students_count} / {group.max_students}{" "}
                                студентов
                            </span>
                        </div>
                    </div>
                    <GroupDropdown
                        group={group}
                        disabled={isPending}
                        onOperationStart={setOperation}
                    />
                </div>

                <div className="mt-4 flex gap-2">
                    <button
                        onClick={handleShowStudents}
                        type="button"
                        className={`
                            flex-1 px-3 py-2 text-sm rounded-lg transition-all duration-200
                            ${
                                isPending
                                    ? "bg-purple-100 text-purple-400 cursor-not-allowed opacity-70"
                                    : "text-purple-600 bg-purple-50 hover:bg-purple-100"
                            }
                        `}
                        disabled={isPending}
                    >
                        <div className="flex items-center justify-center gap-2">
                            {isPending && (
                                <Icon
                                    icon="mdi:loading"
                                    className="w-4 h-4 animate-spin"
                                />
                            )}
                            <span>
                                {isPending
                                    ? "Загрузка..."
                                    : "Показать студентов"}
                            </span>
                        </div>
                    </button>
                </div>

                {students && (
                    <GroupStudentsModal
                        group={group}
                        students={students}
                        isOpen={showStudentsModal}
                        onClose={() => setShowStudentsModal(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default GroupCard;
