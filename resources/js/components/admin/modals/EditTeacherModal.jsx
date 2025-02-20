import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useUpdateTeacher } from "../../../scripts/hooks/useTeachersQueries";

export default function EditTeacherModal({ teacher, onClose }) {
    const [formData, setFormData] = useState({
        email: teacher.email || "",
        name: teacher.name || "",
    });
    const [errors, setErrors] = useState({});

    const { mutate: updateTeacher, isPending } = useUpdateTeacher({
        onError: (error) => {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        },
        onSuccess: (onClose) => {
            onClose();
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        updateTeacher({ id: teacher.id, ...formData });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Редактировать преподавателя
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <Icon icon="mdi:close" className="text-2xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="example@email.com"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                errors.email
                                    ? "border-red-300 focus:ring-red-100 focus:border-red-400"
                                    : "border-gray-300 focus:ring-purple-100 focus:border-purple-400"
                            }`}
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                })
                            }
                        />
                        {errors.email && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.email[0]}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Имя
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Иван Иванов"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                errors.name
                                    ? "border-red-300 focus:ring-red-100 focus:border-red-400"
                                    : "border-gray-300 focus:ring-purple-100 focus:border-purple-400"
                            }`}
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                        />
                        {errors.name && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.name[0]}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-6 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isPending ? (
                                <div className="flex items-center gap-2">
                                    <Icon
                                        icon="mdi:loading"
                                        className="animate-spin"
                                    />
                                    Сохранение...
                                </div>
                            ) : (
                                "Сохранить"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
