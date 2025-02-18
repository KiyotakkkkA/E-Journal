import React from "react";
import GroupDropdown from "./GroupDropdown";
import { Icon } from "@iconify/react";

const GroupCard = ({ group, handleShowStudents }) => {
    return (
        <div
            key={group.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100
              hover:shadow-md transition-shadow duration-200"
        >
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
                    <GroupDropdown group={group} />
                </div>

                <div className="mt-4 flex gap-2">
                    <button
                        onClick={() => handleShowStudents(group)}
                        className="flex-1 px-3 py-2 text-sm text-purple-600 bg-purple-50
                         rounded-lg hover:bg-purple-100 transition-colors duration-200"
                    >
                        Просмотр студентов
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GroupCard;
