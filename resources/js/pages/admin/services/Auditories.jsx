import React, { useState } from "react";
import MenuLayout from "@/layouts/MenuLayout";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import {
    useAuditoriums,
    useCreateAuditorium,
    useUpdateAuditorium,
    useDeleteAuditorium,
} from "@/scripts/hooks/useAuditoriumsQueries";
import AuditoriumFormModal from "@/components/admin/modals/AuditoriumFormModal";
import DeleteConfirmationModal from "@/components/admin/modals/DeleteConfirmationModal";
import { toast } from "react-hot-toast";

const AuditoriumCard = ({ auditorium, onEdit, onDelete }) => {
    const getTypeIcon = (type) => {
        switch (type) {
            case "regular":
                return "mdi:desk";
            case "lecture":
                return "mdi:presentation";
            case "computer":
                return "mdi:desktop-classic";
            case "laboratory":
                return "mdi:test-tube";
            case "conference":
                return "mdi:account-group";
            default:
                return "mdi:door";
        }
    };

    const getTypeName = (type) => {
        switch (type) {
            case "regular":
                return "Обычная";
            case "lecture":
                return "Лекционная";
            case "computer":
                return "Компьютерный класс";
            case "laboratory":
                return "Лаборатория";
            case "conference":
                return "Конференц-зал";
            default:
                return type;
        }
    };

    return (
        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-200 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-100 rounded-xl">
                        <Icon
                            icon={getTypeIcon(auditorium.type)}
                            className="text-2xl text-purple-600"
                        />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Аудитория {auditorium.number}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {auditorium.name}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(auditorium)}
                        className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                    >
                        <Icon icon="mdi:pencil" className="text-xl" />
                    </button>
                    <button
                        onClick={() => onDelete(auditorium)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                        <Icon icon="mdi:delete" className="text-xl" />
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Icon
                        icon="mdi:account-group"
                        className="text-xl text-gray-400"
                    />
                    <span className="text-gray-600">
                        Вместимость: {auditorium.capacity} чел.
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Icon icon="mdi:tag" className="text-xl text-gray-400" />
                    <span className="text-gray-600">
                        Тип: {getTypeName(auditorium.type)}
                    </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                    {auditorium.has_projector && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                            Проектор
                        </span>
                    )}
                    {auditorium.has_internet && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                            Интернет
                        </span>
                    )}
                    {auditorium.equipment?.map((item, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                        >
                            {item}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function Auditories() {
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAuditorium, setSelectedAuditorium] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const { data: auditoriums, isLoading } = useAuditoriums();
    const { mutate: createAuditorium, isPending: isCreating } =
        useCreateAuditorium();
    const { mutate: updateAuditorium, isPending: isUpdating } =
        useUpdateAuditorium();
    const { mutate: deleteAuditorium, isPending: isDeleting } =
        useDeleteAuditorium();

    const handleCreate = (data) => {
        createAuditorium(data, {
            onSuccess: () => {
                setShowFormModal(false);
                toast.success("Аудитория успешно создана");
            },
        });
    };

    const handleUpdate = (data) => {
        updateAuditorium(
            { id: selectedAuditorium.id, ...data },
            {
                onSuccess: () => {
                    setShowFormModal(false);
                    setSelectedAuditorium(null);
                    toast.success("Аудитория успешно обновлена");
                },
            }
        );
    };

    const handleDelete = () => {
        if (!selectedAuditorium) return;

        deleteAuditorium(selectedAuditorium.id, {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedAuditorium(null);
                toast.success("Аудитория успешно удалена");
            },
        });
    };

    const filteredAuditoriums = auditoriums?.filter(
        (auditorium) =>
            auditorium.number
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            auditorium.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <MenuLayout>
            <div className="p-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Управление аудиториями
                        </h1>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    setSelectedAuditorium(null);
                                    setShowFormModal(true);
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg
                                hover:bg-purple-700 transition-colors"
                            >
                                <Icon icon="mdi:plus" className="text-xl" />
                                Добавить аудиторию
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

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Поиск аудиторий..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200
                                rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500
                                focus:border-transparent transition-all duration-200
                                placeholder:text-gray-400"
                        />
                        <Icon
                            icon="mdi:magnify"
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-12">
                        <Icon
                            icon="mdi:loading"
                            className="text-4xl text-purple-600 animate-spin mx-auto"
                        />
                        <p className="mt-2 text-gray-600">
                            Загрузка аудиторий...
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAuditoriums?.map((auditorium) => (
                            <AuditoriumCard
                                key={auditorium.id}
                                auditorium={auditorium}
                                onEdit={(auditorium) => {
                                    setSelectedAuditorium(auditorium);
                                    setShowFormModal(true);
                                }}
                                onDelete={(auditorium) => {
                                    setSelectedAuditorium(auditorium);
                                    setShowDeleteModal(true);
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {showFormModal && (
                <AuditoriumFormModal
                    auditorium={selectedAuditorium}
                    onClose={() => {
                        setShowFormModal(false);
                        setSelectedAuditorium(null);
                    }}
                    onSubmit={selectedAuditorium ? handleUpdate : handleCreate}
                    isLoading={isCreating || isUpdating}
                />
            )}

            {showDeleteModal && (
                <DeleteConfirmationModal
                    title="Удаление аудитории"
                    message={`Вы действительно хотите удалить аудиторию ${selectedAuditorium?.number}?`}
                    onConfirm={handleDelete}
                    onCancel={() => {
                        setShowDeleteModal(false);
                        setSelectedAuditorium(null);
                    }}
                    isLoading={isDeleting}
                />
            )}
        </MenuLayout>
    );
}
