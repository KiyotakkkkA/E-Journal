import React from "react";
import { Icon } from "@iconify/react";

const GroupStudentsTable = ({ group, students }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                        <Icon
                            icon="mdi:account-group"
                            className="w-6 h-6 text-purple-500"
                        />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Группа - {group.name}
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {group.students_count} / {group.max_students}{" "}
                            студентов
                        </p>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                                    №
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Имя
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {students.map((student, index) => (
                                <tr
                                    key={student.id}
                                    className="hover:bg-gray-50 transition-colors duration-150"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center mr-3">
                                                <Icon
                                                    icon="mdi:account"
                                                    className="w-4 h-4 text-purple-500"
                                                />
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {student.name}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {student.email}
                                    </td>
                                </tr>
                            ))}
                            {students.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-6 py-4 text-sm text-gray-500 text-center"
                                    >
                                        В группе пока нет студентов
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default GroupStudentsTable;
