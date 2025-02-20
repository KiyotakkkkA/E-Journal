import React from "react";
import { Icon } from "@iconify/react";
import { useDeleteTeacher } from "../../../scripts/hooks/useTeachersQueries";

export default function DeleteTeacherModal({ teacher, onClose }) {
    const { mutate: deleteTeacher, isPending } = useDeleteTeacher({
        onSuccess: (onClose) => {
            onClose();
        },
    });

    const handleDelete = () => {
        deleteTeacher(teacher.id);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Удалить преподавателя
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <Icon icon="mdi:close" className="text-2xl" />
                    </button>
                </div>

                <div className="space-y-4">
                    <p className="text-gray-600">
                        Вы действительно хотите удалить преподавателя{" "}
                        <span className="font-medium text-gray-900">
                            {teacher.name || teacher.email}
                        </span>
                        ? Это действие нельзя отменить.
                    </p>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                        >
                            Отмена
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isPending}
                            className="px-6 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isPending ? (
                                <div className="flex items-center gap-2">
                                    <Icon
                                        icon="mdi:loading"
                                        className="animate-spin"
                                    />
                                    Удаление...
                                </div>
                            ) : (
                                "Удалить"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
