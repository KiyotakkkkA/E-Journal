import React, { useState } from "react";
import MenuLayout from "../../../layouts/MenuLayout";
import { useAuth } from "../../../contexts/AuthContext";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import AttendanceTable from "../../../components/attendance/AttendanceTable";
import GroupSelector from "../../../components/attendance/GroupSelector";
import DateSelector from "../../../components/attendance/DateSelector";

export default function Attendance() {
    const { roles } = useAuth();
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const canManageAttendance = roles.isTeacher || roles.isAdmin;

    return (
        <MenuLayout>
            <div className="p-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Посещаемость
                        </h1>
                        <Link
                            to="/services"
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
                    <p className="text-gray-600">
                        {canManageAttendance
                            ? "Управление посещаемостью студентов"
                            : "Просмотр посещаемости группы"}
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <GroupSelector
                            selectedGroup={selectedGroup}
                            onGroupSelect={setSelectedGroup}
                        />
                        <DateSelector
                            selectedDate={selectedDate}
                            onDateSelect={setSelectedDate}
                        />
                    </div>

                    {selectedGroup ? (
                        <AttendanceTable
                            groupId={selectedGroup.id}
                            date={selectedDate}
                            canManage={canManageAttendance}
                        />
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <Icon
                                icon="mdi:account-group"
                                className="text-6xl text-gray-300 mb-4 mx-auto"
                            />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Выберите группу
                            </h3>
                            <p className="text-gray-500">
                                Для просмотра посещаемости необходимо выбрать
                                группу
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </MenuLayout>
    );
}
