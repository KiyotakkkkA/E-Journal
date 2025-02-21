import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import MenuLayout from "../../../layouts/MenuLayout";
import AnimatedLoader from "../../../components/elements/AnimatedLoader";
import InstitutesList from "../../../components/admin/org/InstitutesList";
import CafedrasList from "../../../components/admin/org/CafedrasList";
import TeachersList from "../../../components/admin/org/TeachersList";
import {
    useInstitutes,
    useCafedras,
    useCafedraTeachers,
    useAssignTeachers,
} from "../../../scripts/hooks/useOrgQueries";
import InstituteFormModal from "../../../components/admin/modals/InstituteFormModal";
import {
    useCreateInstitute,
    useUpdateInstitute,
    useDeleteInstitute,
} from "../../../scripts/hooks/useOrgQueries";
import DeleteConfirmationModal from "../../../components/admin/modals/DeleteConfirmationModal";
import DeleteCafedraConfirmationModal from "../../../components/admin/modals/DeleteCafedraConfirmationModal";
import CafedraFormModal from "../../../components/admin/modals/CafedraFormModal";
import {
    useCreateCafedra,
    useUpdateCafedra,
    useDeleteCafedra,
    useRemoveTeacher,
} from "../../../scripts/hooks/useOrgQueries";
import TeacherAssignModal from "../../../components/admin/modals/TeacherAssignModal";

export default function OrgStructure() {
    const [activeInstitute, setActiveInstitute] = useState(null);
    const [activeCafedra, setActiveCafedra] = useState(null);
    const [isInstituteFormOpen, setIsInstituteFormOpen] = useState(false);
    const [isCafedraFormOpen, setIsCafedraFormOpen] = useState(false);
    const [isTeacherAssignOpen, setIsTeacherAssignOpen] = useState(false);
    const [editingInstitute, setEditingInstitute] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleteCafedraModalOpen, setIsDeleteCafedraModalOpen] =
        useState(false);
    const [instituteToDelete, setInstituteToDelete] = useState(null);
    const [cafedraToDelete, setCafedraToDelete] = useState(null);
    const [editingCafedra, setEditingCafedra] = useState(null);

    const { data: institutes, isLoading: isInstitutesLoading } =
        useInstitutes();
    const { data: cafedras, isLoading: isCafedrasLoading } = useCafedras(
        activeInstitute?.id || null
    );
    const { data: teachers, isLoading: isTeachersLoading } = useCafedraTeachers(
        activeCafedra?.id || null
    );
    const { mutate: createInstitute, isPending: isCreateInstituteLoading } =
        useCreateInstitute();
    const { mutate: updateInstitute, isPending: isUpdateInstituteLoading } =
        useUpdateInstitute();
    const { mutate: deleteInstitute, isPending: isDeleteInstituteLoading } =
        useDeleteInstitute();
    const { mutate: createCafedra, isPending: isCreateCafedraLoading } =
        useCreateCafedra();
    const { mutate: updateCafedra, isPending: isUpdateCafedraLoading } =
        useUpdateCafedra();
    const { mutate: deleteCafedra, isPending: isDeleteCafedraLoading } =
        useDeleteCafedra();
    const { mutate: assignTeachers, isPending: isAssignTeachersLoading } =
        useAssignTeachers();
    const { mutate: removeTeacher, isPending: isRemoveTeacherLoading } =
        useRemoveTeacher();

    const handleCreateInstitute = (name) => {
        createInstitute(
            {
                name,
            },
            {
                onSuccess: () => {
                    setIsInstituteFormOpen(false);
                },
            }
        );
    };

    const handleUpdateInstitute = (name) => {
        updateInstitute(
            { id: editingInstitute.id, name },
            {
                onSuccess: () => {
                    setIsInstituteFormOpen(false);
                    setEditingInstitute(null);
                },
            }
        );
    };

    const handleEditInstitute = (institute) => {
        setEditingInstitute(institute);
        setIsInstituteFormOpen(true);
    };

    const handleInstituteSelect = (institute) => {
        if (activeInstitute?.id === institute.id) {
            setActiveInstitute(null);
            setActiveCafedra(null);
        } else {
            setActiveInstitute(institute);
            setActiveCafedra(null);
        }
    };

    const handleCafedraSelect = (cafedra) => {
        if (activeCafedra?.id === cafedra.id) {
            setActiveCafedra(null);
        } else {
            setActiveCafedra(cafedra);
        }
    };

    const handleDeleteInstitute = (institute) => {
        deleteInstitute(institute, {
            onSuccess: () => {
                setInstituteToDelete(null);
                setIsDeleteModalOpen(false);
                if (activeInstitute?.id === institute.id) {
                    setActiveInstitute(null);
                }
            },
        });
    };

    const handleCreateCafedra = (name) => {
        createCafedra(
            {
                name,
                institute_id: activeInstitute.id,
            },
            {
                onSuccess: () => {
                    setIsCafedraFormOpen(false);
                },
            }
        );
    };

    const handleUpdateCafedra = (name) => {
        updateCafedra(
            {
                id: editingCafedra.id,
                name,
                institute_id: activeInstitute.id,
            },
            {
                onSuccess: () => {
                    setIsCafedraFormOpen(false);
                    setEditingCafedra(null);
                },
            }
        );
    };

    const handleDeleteCafedra = (cafedra) => {
        deleteCafedra(cafedra, {
            onSuccess: () => {
                setCafedraToDelete(null);
                setIsDeleteCafedraModalOpen(false);
            },
        });
    };

    const handleAssignTeachers = (teachers) => {
        assignTeachers(
            {
                id: activeCafedra.id,
                teachers,
            },
            {
                onSuccess: () => {
                    setIsTeacherAssignOpen(false);
                },
            }
        );
    };

    if (isInstitutesLoading || isCafedrasLoading || isTeachersLoading) {
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
                        Организационная структура
                    </h1>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsInstituteFormOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            <Icon icon="mdi:plus" className="text-xl" />
                            Добавить институт
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <InstitutesList
                        institutes={institutes}
                        activeInstitute={activeInstitute}
                        onInstituteSelect={handleInstituteSelect}
                        onEdit={handleEditInstitute}
                        onDelete={(institute) => {
                            setInstituteToDelete(institute);
                            setIsDeleteModalOpen(true);
                        }}
                    />

                    <CafedrasList
                        activeInstitute={activeInstitute}
                        activeCafedra={activeCafedra}
                        onCafedraSelect={handleCafedraSelect}
                        onAddCafedra={() => setIsCafedraFormOpen(true)}
                        onEditCafedra={(cafedra) => {
                            setEditingCafedra(cafedra);
                            setIsCafedraFormOpen(true);
                        }}
                        onDeleteCafedra={(cafedra) => {
                            setCafedraToDelete(cafedra);
                            setIsDeleteCafedraModalOpen(true);
                        }}
                        cafedras={cafedras}
                        isLoading={isCafedrasLoading}
                    />

                    <TeachersList
                        activeInstitute={activeInstitute}
                        activeCafedra={activeCafedra}
                        onAssignTeacher={() => setIsTeacherAssignOpen(true)}
                        onRemoveTeacher={(teacher) => {
                            removeTeacher({
                                cafedraId: activeCafedra.id,
                                teacherId: teacher.id,
                            });
                        }}
                        teachers={teachers}
                    />
                </div>

                {isInstituteFormOpen && (
                    <InstituteFormModal
                        institute={editingInstitute}
                        onClose={() => {
                            setIsInstituteFormOpen(false);
                            setEditingInstitute(null);
                        }}
                        onSubmit={
                            editingInstitute
                                ? handleUpdateInstitute
                                : handleCreateInstitute
                        }
                        isLoading={
                            isCreateInstituteLoading ||
                            isUpdateInstituteLoading ||
                            isDeleteInstituteLoading
                        }
                    />
                )}

                {isCafedraFormOpen && activeInstitute && (
                    <CafedraFormModal
                        cafedra={editingCafedra}
                        institute={activeInstitute}
                        onClose={() => {
                            setIsCafedraFormOpen(false);
                            setEditingCafedra(null);
                        }}
                        onSubmit={
                            editingCafedra
                                ? handleUpdateCafedra
                                : handleCreateCafedra
                        }
                        isLoading={
                            isCreateCafedraLoading ||
                            isUpdateCafedraLoading ||
                            isDeleteCafedraLoading
                        }
                    />
                )}

                {isDeleteCafedraModalOpen && (
                    <DeleteCafedraConfirmationModal
                        title="Удаление кафедры"
                        message={`Вы действительно хотите удалить кафедру "${cafedraToDelete?.name}"?`}
                        onConfirm={() => handleDeleteCafedra(cafedraToDelete)}
                        onCancel={() => {
                            setIsDeleteCafedraModalOpen(false);
                            setCafedraToDelete(null);
                        }}
                        isLoading={isDeleteCafedraLoading}
                    />
                )}

                {isDeleteModalOpen && instituteToDelete && (
                    <DeleteConfirmationModal
                        title="Удаление института"
                        message={`Вы действительно хотите удалить институт "${instituteToDelete.name}"?`}
                        onConfirm={() =>
                            handleDeleteInstitute(instituteToDelete)
                        }
                        onCancel={() => {
                            setIsDeleteModalOpen(false);
                            setInstituteToDelete(null);
                        }}
                        isLoading={isDeleteInstituteLoading}
                    />
                )}

                {isTeacherAssignOpen && activeCafedra && (
                    <TeacherAssignModal
                        cafedra={activeCafedra}
                        onClose={() => setIsTeacherAssignOpen(false)}
                        onSubmit={handleAssignTeachers}
                        isLoading={isAssignTeachersLoading}
                    />
                )}
            </div>
        </MenuLayout>
    );
}
