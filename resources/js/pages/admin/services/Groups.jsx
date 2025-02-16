import React, { useState, useEffect } from "react";
import MenuLayout from "../../../layouts/MenuLayout";
import { Icon } from "@iconify/react";
import AnimatedLoader from "../../../components/elements/AnimatedLoader";
import { getGroups } from "../../../scripts/graphql";
import GroupForm from "../../../components/admin/groups/GroupForm";
import GroupList from "../../../components/admin/groups/GroupList";
import GroupStudentsModal from "../../../components/admin/groups/GroupStudentsModal";

const Groups = ({ canViewAdminPanel }) => {
    const [groups, setGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newGroup, setNewGroup] = useState({
        name: "",
        max_students: 30,
    });
    const [errors, setErrors] = useState({});
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groupStudents, setGroupStudents] = useState([]);
    const [showStudentsModal, setShowStudentsModal] = useState(false);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            setIsLoading(true);
            const response = await getGroups();
            setGroups(response.data.groups);
        } catch (error) {
            console.error("Error fetching groups:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/admin/groups", newGroup);
            setGroups([...groups, response.data.group]);
            setShowAddForm(false);
            setNewGroup({ name: "", max_students: 30 });
            setErrors({});
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        }
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

    if (isLoading) return <AnimatedLoader />;

    return (
        <MenuLayout canViewAdminPanel={canViewAdminPanel}>
            <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0">Управление группами</h2>
                    <button
                        className="btn btn-purple"
                        onClick={() => setShowAddForm(!showAddForm)}
                    >
                        <Icon icon="mdi:plus" className="me-2" />
                        Добавить группу
                    </button>
                </div>

                {showAddForm && (
                    <GroupForm
                        newGroup={newGroup}
                        setNewGroup={setNewGroup}
                        errors={errors}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                    />
                )}

                <GroupList
                    groups={groups}
                    onShowStudents={handleShowStudents}
                />

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
