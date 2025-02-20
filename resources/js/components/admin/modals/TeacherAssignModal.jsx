import React, { useState } from "react";
import { Icon } from "@iconify/react";
import AnimatedLoader from "../../elements/AnimatedLoader";
import { useTeachers } from "../../../scripts/hooks/useTeachersQueries";

export default function TeacherAssignModal({
    cafedra,
    onClose,
    onSubmit,
    isLoading,
}) {
    const [selectedTeachers, setSelectedTeachers] = useState([]);
    const { data: teachers, isLoading: isTeachersLoading } = useTeachers(true);

    const handleTeacherToggle = (teacher) => {
        if (selectedTeachers.find((t) => t.id === teacher.id)) {
            setSelectedTeachers(
                selectedTeachers.filter((t) => t.id !== teacher.id)
            );
        } else {
            setSelectedTeachers([...selectedTeachers, teacher]);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                        Назначить преподавателей
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Кафедра: {cafedra.name}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                >
                    <Icon icon="mdi:close" className="text-2xl" />
                </button>
            </div>

            {isTeachersLoading ? (
                <div className="flex justify-center py-12">
                    <AnimatedLoader className="w-8 h-8" />
                </div>
            ) : (
                <>
                    <div className="mb-6">
                        <div className="border rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="w-12 py-3 pl-4"
                                        >
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                                                    checked={
                                                        selectedTeachers.length ===
                                                        teachers.length
                                                    }
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedTeachers(
                                                                teachers
                                                            );
                                                        } else {
                                                            setSelectedTeachers(
                                                                []
                                                            );
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="w-12 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                                        >
                                            №
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                                        >
                                            ФИО
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                                        >
                                            Email
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {teachers.map((teacher, index) => (
                                        <tr
                                            key={teacher.id}
                                            onClick={() =>
                                                handleTeacherToggle(teacher)
                                            }
                                            className={`cursor-pointer transition-colors ${
                                                selectedTeachers.find(
                                                    (t) => t.id === teacher.id
                                                )
                                                    ? "bg-purple-50"
                                                    : "hover:bg-gray-50"
                                            }`}
                                        >
                                            <td className="py-3 pl-4">
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                                                        checked={selectedTeachers.some(
                                                            (t) =>
                                                                t.id ===
                                                                teacher.id
                                                        )}
                                                        onChange={() =>
                                                            handleTeacherToggle(
                                                                teacher
                                                            )
                                                        }
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                    />
                                                </div>
                                            </td>
                                            <td className="py-3 text-sm text-gray-500">
                                                {index + 1}
                                            </td>
                                            <td className="px-3 py-3 text-sm text-gray-900">
                                                {teacher.name || "—"}
                                            </td>
                                            <td className="px-3 py-3 text-sm text-gray-500">
                                                {teacher.email}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Выбрано: {selectedTeachers.length} из{" "}
                            {teachers.length}
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={() => onSubmit(selectedTeachers)}
                                disabled={
                                    selectedTeachers.length === 0 || isLoading
                                }
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:bg-gray-200 disabled:text-gray-400 transition-all"
                            >
                                {isLoading && (
                                    <AnimatedLoader className="w-4 h-4" />
                                )}
                                Назначить
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
