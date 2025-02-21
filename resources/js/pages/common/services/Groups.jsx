import React, { useState, useMemo } from "react";
import MenuLayout from "../../../layouts/MenuLayout";
import AnimatedLoader from "../../../components/elements/AnimatedLoader";
import GroupForm from "../../../components/admin/groups/GroupForm";
import GroupCard from "../../../components/admin/groups/GroupCard";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import {
    useGroups,
    useCreateGroup,
} from "../../../scripts/hooks/useGroupsQueries";
import { useAuth } from "../../../contexts/AuthContext";
import GroupStudentsTable from "../../../components/common/groups/GroupStudentsTable";

const EmptyState = ({ onAddClick }) => (
    <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
            <Icon
                icon="mdi:account-group"
                className="text-3xl text-purple-600"
            />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
            Нет активных групп
        </h3>
        <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            Создайте свою первую учебную группу, чтобы начать управление
            студентами
        </p>
        <button
            onClick={onAddClick}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200"
        >
            <Icon icon="mdi:plus" className="mr-2" />
            Создать группу
        </button>
    </div>
);

const Groups = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newGroup, setNewGroup] = useState({
        name: "",
        max_students: 30,
    });
    const [errors, setErrors] = useState({});
    const [creatingGroup, setCreatingGroup] = useState(null);

    const { mutate: createGroup, isPending: isCreateGroupPending } =
        useCreateGroup();

    const { data: groups = [], isLoading, error } = useGroups();

    const { roles, isInGroup } = useAuth();

    const allGroups = useMemo(() => {
        if (creatingGroup) {
            return [...groups, { ...creatingGroup, isCreating: true }];
        }
        return groups;
    }, [groups, creatingGroup]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCreatingGroup(newGroup);
        createGroup(newGroup, {
            onSuccess: () => {
                setCreatingGroup(null);
                setNewGroup({
                    name: "",
                    max_students: 30,
                });
            },
            onError: () => {
                setCreatingGroup(null);
            },
        });
    };

    const handleCancel = () => {
        setShowAddForm(false);
        setErrors({});
    };

    if (isLoading)
        return (
            <MenuLayout>
                <AnimatedLoader className="mt-4" />
            </MenuLayout>
        );

    if (error) {
        return (
            <MenuLayout>
                <div className="text-center text-red-500">
                    Произошла ошибка при загрузке данных
                </div>
            </MenuLayout>
        );
    }

    if ((!isInGroup || !groups?.length) && !roles.isAdmin) {
        return (
            <MenuLayout>
                <div className="text-center text-gray-500">
                    Вы не состоите ни в одной группе
                </div>
            </MenuLayout>
        );
    }

    const group = groups[0];

    return (
        <MenuLayout>
            <div className="container mx-auto px-4 py-8">
                {roles.isAdmin || roles.isTeacher ? (
                    <>
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    Управление группами
                                </h1>
                                <p className="text-gray-600">
                                    Управляйте учебными группами и их
                                    участниками
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowAddForm(!showAddForm)}
                                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg
                                    hover:bg-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                    <Icon icon="mdi:plus" className="mr-2" />
                                    Добавить группу
                                </button>
                                <Link
                                    to="/services"
                                    className="p-2 text-gray-500 hover:text-gray-600 bg-gray-100 hover:bg-gray-200
                                    rounded-lg transition-all duration-200"
                                >
                                    <Icon
                                        icon="mdi:arrow-left"
                                        className="text-xl"
                                    />
                                </Link>
                            </div>
                        </div>

                        {showAddForm && (
                            <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="px-6 py-4 bg-purple-50 border-b border-purple-100">
                                    <h3 className="text-lg font-medium text-purple-900">
                                        Создание новой группы
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <GroupForm
                                        newGroup={newGroup}
                                        setNewGroup={setNewGroup}
                                        errors={errors}
                                        onSubmit={handleSubmit}
                                        onCancel={handleCancel}
                                        isLoading={isCreateGroupPending}
                                    />
                                </div>
                            </div>
                        )}

                        {groups.length === 0 && !isLoading ? (
                            <EmptyState
                                onAddClick={() => setShowAddForm(true)}
                            />
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {allGroups.map((group) => (
                                    <div
                                        key={
                                            group.isCreating
                                                ? "creating"
                                                : group.id
                                        }
                                    >
                                        {group.isCreating ? (
                                            <div className="bg-white rounded-xl shadow-sm border border-purple-200 p-6 relative overflow-hidden">
                                                <div
                                                    className="absolute inset-0 bg-purple-50/50 backdrop-blur-sm
                                                flex items-center justify-center"
                                                >
                                                    <div
                                                        className="flex items-center gap-2 px-4 py-2 bg-purple-100
                                                    rounded-lg text-purple-700"
                                                    >
                                                        <AnimatedLoader className="w-5 h-5" />
                                                        <span>
                                                            Создание группы...
                                                        </span>
                                                    </div>
                                                </div>
                                                <GroupCard group={group} />
                                            </div>
                                        ) : (
                                            <GroupCard group={group} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 bg-purple-50 border-b border-purple-100">
                                <h2 className="text-lg font-medium text-purple-900">
                                    Информация о группе
                                </h2>
                            </div>
                            <div className="p-6">
                                {group?.students ? (
                                    <GroupStudentsTable
                                        group={group}
                                        students={group.students}
                                    />
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <Icon
                                            icon="mdi:alert-circle-outline"
                                            className="text-4xl mx-auto mb-2"
                                        />
                                        <p>Нет данных о студентах группы</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MenuLayout>
    );
};

export default Groups;
