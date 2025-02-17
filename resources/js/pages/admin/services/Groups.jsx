import React, { useState } from "react";
import MenuLayout from "../../../layouts/MenuLayout";
import AnimatedLoader from "../../../components/elements/AnimatedLoader";
import GroupForm from "../../../components/admin/groups/GroupForm";
import GroupDropdown from "../../../components/admin/groups/GroupDropdown";
import GroupStudentsModal from "../../../components/admin/groups/GroupStudentsModal";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import {
    useGroups,
    useCreateGroup,
} from "../../../scripts/hooks/useGroupsQueries";

const Groups = ({ canViewAdminPanel }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newGroup, setNewGroup] = useState({
        name: "",
        max_students: 30,
    });
    const [errors, setErrors] = useState({});
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groupStudents, setGroupStudents] = useState([]);
    const [showStudentsModal, setShowStudentsModal] = useState(false);

    const { mutate: createGroup, isPending: isCreateGroupPending } =
        useCreateGroup();

    const { data: groups, isLoading, error } = useGroups();

    const handleSubmit = async (e) => {
        e.preventDefault();
        createGroup(newGroup);
    };

    const handleCancel = () => {
        setShowAddForm(false);
        setErrors({});
    };

    const handleShowStudents = async (group) => {
        try {
            const response = await axios.get(
                `/api/admin/groups/students?group_id=${group.id}`
            );
            setGroupStudents(response.data.students);
            setSelectedGroup(group);
            setShowStudentsModal(true);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    if (isLoading) return <AnimatedLoader className="mt-4" />;

    return (
        <MenuLayout canViewAdminPanel={canViewAdminPanel}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Управление группами
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Управляйте учебными группами и их участниками
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
                            <Icon icon="mdi:plus" className="mr-2 text-xl" />
                            Добавить группу
                        </button>
                        <Link
                            to="/admin"
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
                    {groups.map((group) => (
                        <div
                            key={group.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-100
                                      hover:shadow-md transition-shadow duration-200"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {group.name}
                                        </h3>
                                        <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                                            <Icon icon="mdi:account-group" />
                                            <span>
                                                {group.students_count} /{" "}
                                                {group.max_students} студентов
                                            </span>
                                        </div>
                                    </div>
                                    <GroupDropdown group={group} />
                                </div>

                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={() =>
                                            handleShowStudents(group)
                                        }
                                        className="flex-1 px-3 py-2 text-sm text-purple-600 bg-purple-50
                                                 rounded-lg hover:bg-purple-100 transition-colors duration-200"
                                    >
                                        Просмотр студентов
                                    </button>
                                </div>
                            </div>
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

                <GroupStudentsModal
                    group={selectedGroup}
                    students={groupStudents}
                    isOpen={showStudentsModal}
                    onClose={() => setShowStudentsModal(false)}
                />
            </div>
        </MenuLayout>
    );
};

export default Groups;
