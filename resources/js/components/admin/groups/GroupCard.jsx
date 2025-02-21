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
    const [isHoveringButtons, setIsHoveringButtons] = useState(false);

    const handleShowStudents = () => {
        if (!showStudentsModal && !isHoveringButtons) {
            fetchStudents();
            setShowStudentsModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowStudentsModal(false);
    };

    const handleEdit = () => {
        setOperation("editing");
        setTimeout(() => setOperation(null), 1000);
    };

    const handleDelete = () => {
        setOperation("deleting");
        setTimeout(() => setOperation(null), 1000);
    };

    const getCardStyle = () => {
        if (operation === "deleting") {
            return "bg-red-50 border-red-100";
        }
        if (operation === "editing") {
            return "bg-green-50 border-green-100";
        }
        return "";
    };

    const getOperationText = () => {
        if (operation === "deleting") return "Удаление...";
        if (operation === "editing") return "Редактирование...";
        return null;
    };

    const studentsCount = group.students_count || 0;
    const maxStudents = group.max_students || 30;
    const percentage = (studentsCount / maxStudents) * 100;

    return (
        <>
            <div
                onClick={handleShowStudents}
                className={`
                    group bg-white rounded-xl border border-gray-200 p-6
                    hover:border-purple-200 hover:shadow-md
                    transition-all duration-300 cursor-pointer
                    relative overflow-hidden
                    ${getCardStyle()}
                    ${isPending ? "opacity-70 pointer-events-none" : ""}
                `}
            >
                <div
                    className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-purple-50
                transition-transform duration-500 group-hover:scale-150"
                />

                <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3
                                className="text-lg font-semibold text-gray-900 group-hover:text-purple-600
                            transition-colors duration-300 flex items-center gap-2"
                            >
                                <Icon
                                    icon="mdi:school"
                                    className="text-lg text-gray-400"
                                />
                                {group.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                    ${
                                        group.students_count > 0
                                            ? "bg-green-50 text-green-700"
                                            : "bg-gray-100 text-gray-600"
                                    }`}
                                >
                                    <Icon
                                        icon={
                                            group.students_count > 0
                                                ? "mdi:check-circle"
                                                : "mdi:clock-outline"
                                        }
                                        className="mr-1"
                                    />
                                    {group.students_count > 0
                                        ? "Активна"
                                        : "Неактивна"}
                                </span>
                            </div>
                        </div>

                        <div
                            className="flex items-center gap-2"
                            onMouseEnter={() => setIsHoveringButtons(true)}
                            onMouseLeave={() => setIsHoveringButtons(false)}
                        >
                            <button
                                className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50
                                rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleShowStudents();
                                }}
                            >
                                <Icon
                                    icon="mdi:chevron-right"
                                    className="text-xl"
                                />
                            </button>
                            <GroupDropdown
                                group={group}
                                onOperationStart={setOperation}
                                disabled={isPending}
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">
                                Заполненность
                            </span>
                            <span className="text-sm text-gray-500">
                                {studentsCount} / {maxStudents}
                            </span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-300
                                ${
                                    percentage >= 100
                                        ? "bg-red-500"
                                        : percentage >= 75
                                        ? "bg-orange-500"
                                        : "bg-green-500"
                                }`}
                                style={{
                                    width: `${Math.min(percentage, 100)}%`,
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <Icon
                                icon="mdi:account-group"
                                className="text-lg text-gray-400"
                            />
                            <span>{studentsCount} студентов</span>
                        </div>
                    </div>

                    <div
                        className="mt-4 flex items-center text-sm font-medium text-gray-600
                    group-hover:text-purple-600 transition-colors duration-300"
                    >
                        <span>Просмотреть студентов</span>
                        <Icon
                            icon="mdi:arrow-right"
                            className="ml-1 text-base transition-transform duration-300
                            group-hover:translate-x-1"
                        />
                    </div>
                </div>

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
            </div>

            {students && (
                <GroupStudentsModal
                    group={group}
                    students={students}
                    isOpen={showStudentsModal}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};

export default GroupCard;
