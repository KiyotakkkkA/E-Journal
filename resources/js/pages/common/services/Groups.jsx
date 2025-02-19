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
        <div>
            {roles.isAdmin || roles.isTeacher ? (
                <MenuLayout>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Управление группами
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Управляйте учебными группами и их
                                    участниками
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white
                                 rounded-lg hover:bg-purple-700 transition-all duration-200
                                 shadow-sm hover:shadow-md active:shadow-sm
                                 transform hover:-translate-y-0.5 active:translate-y-0"
                                    onClick={() => setShowAddForm(!showAddForm)}
                                >
                                    <Icon
                                        icon="mdi:plus"
                                        className="mr-2 text-xl"
                                    />
                                    Добавить группу
                                </button>
                                <Link
                                    to="/services"
                                    className="text-gray-500 hover:text-gray-600
                            transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 hover:scale-10"
                                >
                                    <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-all duration-200">
                                        <Icon
                                            icon="mdi:arrow-left"
                                            className="text-xl"
                                        />
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {showAddForm && (
                            <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                                    />
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {allGroups.map((group, index) => (
                                <div
                                    key={
                                        group.isCreating ? "creating" : group.id
                                    }
                                >
                                    {group.isCreating ? (
                                        <div
                                            className={`
                                                bg-blue-50 rounded-xl shadow-sm border border-blue-100
                                                relative
                                            `}
                                        >
                                            <div className="absolute inset-0 rounded-xl flex items-center justify-center bg-opacity-50 backdrop-blur-sm bg-blue-100">
                                                <div className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700">
                                                    <span className="text-lg font-medium">
                                                        Создание...
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-lg font-medium text-gray-900">
                                                            {group.name}
                                                        </h3>
                                                        <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                                                            <Icon icon="mdi:account-group" />
                                                            <span>
                                                                0 /{" "}
                                                                {
                                                                    group.max_students
                                                                }{" "}
                                                                студентов
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <GroupCard group={group} />
                                    )}
                                </div>
                            ))}
                        </div>

                        {groups.length === 0 && !isLoading && (
                            <div className="text-center py-12">
                                <Icon
                                    icon="mdi:account-group"
                                    className="mx-auto h-12 w-12 text-gray-400"
                                />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">
                                    Нет групп
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Начните с создания новой группы
                                </p>
                            </div>
                        )}
                    </div>
                </MenuLayout>
            ) : (
                <MenuLayout>
                    <div className="container mx-auto px-4 py-8">
                        <div className="max-w-4xl mx-auto">
                            {group.students ? (
                                <GroupStudentsTable
                                    group={group}
                                    students={group.students}
                                />
                            ) : (
                                <div className="text-center bg-red-400 text-black font-bold border border-red-500 rounded-lg p-4">
                                    Ошибка: нет данных о студентах данной группы
                                </div>
                            )}
                        </div>
                    </div>
                </MenuLayout>
            )}
        </div>
    );
};

export default Groups;
