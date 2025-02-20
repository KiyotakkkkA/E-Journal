import React, { useState } from "react";
import { Icon } from "@iconify/react";
import AnimatedLoader from "../../../components/elements/AnimatedLoader";
import MenuLayout from "../../../layouts/MenuLayout";
import { useTeachers } from "../../../scripts/hooks/useTeachersQueries";
import AddTeacherModal from "../../../components/admin/modals/AddTeacherModal";
export default function Teachers() {
    const [isFormOpen, setIsFormOpen] = useState(false);

    const { data: teachers, isLoading } = useTeachers();

    if (isLoading) {
        return (
            <MenuLayout>
                <AnimatedLoader />
            </MenuLayout>
        );
    }

    return (
        <MenuLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Преподаватели
                    </h1>
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        <Icon icon="mdi:plus" className="text-xl" />
                        Добавить преподавателя
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Статус
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Действия
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {teachers?.map((teacher) => (
                                    <tr key={teacher.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {teacher.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    teacher.email_verified_at
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                }`}
                                            >
                                                {teacher.email_verified_at
                                                    ? "Подтвержден"
                                                    : "Не подтвержден"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button className="text-red-600 hover:text-red-900">
                                                Удалить
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {isFormOpen && (
                    <AddTeacherModal onClose={() => setIsFormOpen(false)} />
                )}
            </div>
        </MenuLayout>
    );
}
