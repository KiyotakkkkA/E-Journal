import MenuLayout from "@/layouts/MenuLayout";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { useState } from "react";
import DisciplineFormModal from "@/components/admin/modals/DisciplineFormModal";
import {
    useDisciplines,
    useCreateDiscipline,
    useUpdateDiscipline,
    useDeleteDiscipline,
} from "@/scripts/hooks/useDisciplinesQueries";
import AnimatedLoader from "@/components/elements/AnimatedLoader";
import DeleteConfirmationModal from "@/components/admin/modals/DeleteConfirmationModal";

const disciplineTypesNames = {
    lecture: "Лекция",
    practice: "Практика",
    lab: "Лабораторная работа",
    seminar: "Семинар",
};

export default function Disciplines() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingDiscipline, setEditingDiscipline] = useState(null);
    const [deletingDiscipline, setDeletingDiscipline] = useState(null);

    const { data: disciplines, isLoading } = useDisciplines();
    const { mutate: createDiscipline, isPending: isCreating } =
        useCreateDiscipline();
    const { mutate: updateDiscipline, isPending: isUpdating } =
        useUpdateDiscipline();
    const { mutate: deleteDiscipline, isPending: isDeleting } =
        useDeleteDiscipline();

    const handleCreate = (formData) => {
        createDiscipline(formData);
        setIsCreateModalOpen(false);
    };

    const handleUpdate = (formData) => {
        updateDiscipline({ id: editingDiscipline.id, ...formData });
        setEditingDiscipline(null);
    };

    const handleDelete = () => {
        deleteDiscipline(deletingDiscipline.id);
        setDeletingDiscipline(null);
    };

    return (
        <MenuLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Дисциплины
                    </h1>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            <Icon icon="mdi:plus" className="text-xl" />
                            Добавить дисциплину
                        </button>
                        <Link
                            to="/admin"
                            className="text-gray-500 hover:text-gray-600 transition-all duration-200"
                        >
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gray-100 hover:bg-gray-200">
                                <Icon
                                    icon="mdi:arrow-left"
                                    className="text-xl"
                                />
                            </div>
                        </Link>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <AnimatedLoader className="w-8 h-8" />
                    </div>
                ) : disciplines?.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <Icon
                            icon="mdi:book-education-outline"
                            className="text-6xl text-gray-300 mx-auto mb-4"
                        />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Нет дисциплин
                        </h3>
                        <p className="text-gray-500">
                            Добавьте первую дисциплину, нажав кнопку выше
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Код дисциплины
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Название дисциплины
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Типы занятий
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Действия
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {disciplines?.map((discipline) => (
                                        <tr
                                            key={discipline.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <code className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-sm font-mono shadow-sm">
                                                    {discipline.code}
                                                </code>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {discipline.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {discipline.types.map(
                                                        (type) => (
                                                            <span
                                                                key={type}
                                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                                                            >
                                                                {
                                                                    disciplineTypesNames[
                                                                        type
                                                                    ]
                                                                }
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        className="text-purple-600 hover:text-purple-900 p-1 hover:bg-purple-50 rounded-lg transition-colors"
                                                        title="Редактировать"
                                                        onClick={() =>
                                                            setEditingDiscipline(
                                                                discipline
                                                            )
                                                        }
                                                    >
                                                        <Icon
                                                            icon="mdi:pencil"
                                                            className="text-xl"
                                                        />
                                                    </button>
                                                    <button
                                                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Удалить"
                                                        onClick={() =>
                                                            setDeletingDiscipline(
                                                                discipline
                                                            )
                                                        }
                                                    >
                                                        <Icon
                                                            icon="mdi:delete"
                                                            className="text-xl"
                                                        />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <DisciplineFormModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSubmit={handleCreate}
                    isLoading={isCreating}
                />

                <DisciplineFormModal
                    discipline={editingDiscipline}
                    isOpen={!!editingDiscipline}
                    onClose={() => setEditingDiscipline(null)}
                    onSubmit={handleUpdate}
                    isLoading={isUpdating}
                />

                <DeleteConfirmationModal
                    title="Удаление дисциплины"
                    message={
                        deletingDiscipline
                            ? `Вы действительно хотите удалить дисциплину "${deletingDiscipline.name}"? Это действие нельзя отменить.`
                            : ""
                    }
                    isOpen={!!deletingDiscipline}
                    onClose={() => setDeletingDiscipline(null)}
                    onConfirm={handleDelete}
                    isLoading={isDeleting}
                />
            </div>
        </MenuLayout>
    );
}
