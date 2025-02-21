import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import AnimatedLoader from "../../../components/elements/AnimatedLoader";
import MenuLayout from "../../../layouts/MenuLayout";
import { useTeachers } from "../../../scripts/hooks/useTeachersQueries";
import { useBindDisciplineToTeacher } from "../../../scripts/hooks/useDisciplinesQueries";
import AddTeacherModal from "../../../components/admin/modals/AddTeacherModal";
import EditTeacherModal from "../../../components/admin/modals/EditTeacherModal";
import DeleteTeacherModal from "../../../components/admin/modals/DeleteTeacherModal";
import TeacherDisciplinesModal from "@/components/admin/modals/TeacherDisciplinesModal";

export default function Teachers() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [isDeleteFormOpen, setIsDeleteFormOpen] = useState(false);
    const [teacher, setTeacher] = useState(null);
    const [disciplinesTeacher, setDisciplinesTeacher] = useState(null);

    const { mutate: bindDisciplineToTeacher } = useBindDisciplineToTeacher();
    const { data: teachers, isLoading } = useTeachers(false);

    const handleEdit = (teacher) => {
        setTeacher(teacher);
        setIsEditFormOpen(true);
    };

    const handleDelete = (teacher) => {
        setTeacher(teacher);
        setIsDeleteFormOpen(true);
    };

    const handleAddDisciplines = (teacher) => {
        setDisciplinesTeacher(teacher);
    };

    const handleShowDisciplines = (teacher) => {
        setTeacher(teacher);
        setDisciplinesTeacher(teacher);
    };

    const handleSaveDisciplines = async (disciplines) => {
        try {
            const data = {
                teacher_id: disciplinesTeacher.id,
                disciplines: disciplines.map((d) => ({
                    id: d.id,
                    types: d.types,
                })),
            };
            bindDisciplineToTeacher(data);
            setDisciplinesTeacher(null);
        } catch (error) {
            console.error("Ошибка при сохранении дисциплин:", error);
        }
    };

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
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            <Icon icon="mdi:plus" className="text-xl" />
                            Добавить преподавателя
                        </button>
                        <Link
                            to="/admin"
                            className="text-gray-500 hover:text-gray-600
                                 transition-all duration-200 transform
                                 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center
                                      bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                            >
                                <Icon
                                    icon="mdi:arrow-left"
                                    className="text-xl"
                                />
                            </div>
                        </Link>
                    </div>
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
                                        Имя
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Дисциплина
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
                                            <div className="text-sm text-gray-900">
                                                {teacher.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {teacher.disciplines?.length >
                                                0 ? (
                                                    <button
                                                        onClick={() =>
                                                            handleShowDisciplines(
                                                                teacher
                                                            )
                                                        }
                                                        className={`inline-flex items-center gap-2
                                                        px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-lg
                                                        hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all ${
                                                            !teacher.email_verified_at
                                                                ? "hidden"
                                                                : ""
                                                        }`}
                                                    >
                                                        <Icon
                                                            icon="mdi:book-open-variant"
                                                            className="text-xl"
                                                        />
                                                        Показать дисциплины
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            setTeacher(teacher);
                                                            handleAddDisciplines(
                                                                teacher
                                                            );
                                                        }}
                                                        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 hover:text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all ${
                                                            !teacher.email_verified_at
                                                                ? "hidden"
                                                                : ""
                                                        }`}
                                                    >
                                                        <Icon
                                                            icon="mdi:book-plus"
                                                            className="text-xl"
                                                        />
                                                        <span>
                                                            Добавить дисциплины
                                                        </span>
                                                    </button>
                                                )}
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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-4 ">
                                            <button
                                                onClick={() => {
                                                    handleDelete(teacher);
                                                }}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Icon
                                                    icon="mdi:delete"
                                                    className="text-xl"
                                                />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleEdit(teacher);
                                                }}
                                                className="text-purple-600 hover:text-purple-900"
                                            >
                                                <Icon
                                                    icon="mdi:pencil"
                                                    className="text-xl"
                                                />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {isEditFormOpen && (
                        <EditTeacherModal
                            onClose={() => setIsEditFormOpen(false)}
                            teacher={teacher}
                        />
                    )}
                    {isDeleteFormOpen && (
                        <DeleteTeacherModal
                            onClose={() => setIsDeleteFormOpen(false)}
                            teacher={teacher}
                        />
                    )}
                </div>

                {isFormOpen && (
                    <AddTeacherModal onClose={() => setIsFormOpen(false)} />
                )}

                <TeacherDisciplinesModal
                    isOpen={!!disciplinesTeacher}
                    onClose={() => setDisciplinesTeacher(null)}
                    onSubmit={handleSaveDisciplines}
                    teacher={disciplinesTeacher}
                    initialDisciplines={disciplinesTeacher?.disciplines || []}
                />
            </div>
        </MenuLayout>
    );
}
