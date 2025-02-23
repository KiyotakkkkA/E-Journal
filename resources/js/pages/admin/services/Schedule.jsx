import React, { useState } from "react";
import MenuLayout from "@/layouts/MenuLayout";
import { Icon } from "@iconify/react";
import { useGroups } from "@/scripts/hooks/useGroupsQueries";
import { useTeachers } from "@/scripts/hooks/useTeachersQueries";
import { useAuditoriums } from "@/scripts/hooks/useAuditoriumsQueries";
import {
    useSchedule,
    useCreateSchedule,
    useUpdateSchedule,
    useDeleteSchedule,
} from "@/scripts/hooks/useScheduleQueries";
import { toast } from "react-hot-toast";
import AddLessonModal from "@/components/schedule/AddLessonModal";
import ScheduleItem from "@/components/schedule/ScheduleItem";
const DAYS_OF_WEEK = [
    { id: "monday", name: "Понедельник" },
    { id: "tuesday", name: "Вторник" },
    { id: "wednesday", name: "Среда" },
    { id: "thursday", name: "Четверг" },
    { id: "friday", name: "Пятница" },
    { id: "saturday", name: "Суббота" },
];

const TIME_SLOTS = [
    { start: "09:00", end: "10:30" },
    { start: "10:40", end: "12:10" },
    { start: "12:40", end: "14:10" },
    { start: "14:20", end: "15:50" },
    { start: "16:20", end: "17:50" },
    { start: "18:00", end: "19:30" },
];

const WEEK_TYPES = [
    { id: "all", name: "Все недели" },
    { id: "even", name: "Чётная неделя" },
    { id: "odd", name: "Нечётная неделя" },
];

export default function Schedule() {
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedDay, setSelectedDay] = useState("monday");
    const [showLessonModal, setShowLessonModal] = useState(false);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedWeekType, setSelectedWeekType] = useState("all");
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);

    const { data: groups, isLoading: isLoadingGroups } = useGroups();
    const { data: teachers } = useTeachers();
    const { data: auditoriums } = useAuditoriums();
    const { data: schedule, isLoading: isLoadingSchedule } = useSchedule(
        selectedGroup?.id,
        selectedDay,
        selectedWeekType
    );

    const { mutate: createSchedule, isPending: isCreating } =
        useCreateSchedule();
    const { mutate: updateSchedule, isPending: isUpdating } =
        useUpdateSchedule();
    const { mutate: deleteSchedule, isPending: isDeleting } =
        useDeleteSchedule();

    const handleAddLesson = (timeSlot) => {
        setSelectedTimeSlot(timeSlot);
        setShowLessonModal(true);
    };

    const handleEdit = (schedule) => {
        setSelectedSchedule(schedule);
        setShowEditModal(true);
    };

    const handleDelete = (schedule) => {
        setSelectedSchedule(schedule);
        setShowDeleteModal(true);
    };

    const checkTimeSlotConflict = (timeSlot) => {
        return schedule?.find((s) => {
            const scheduleStart = s.start_time.substring(0, 5);
            const scheduleEnd = s.end_time.substring(0, 5);
            return (
                scheduleStart === timeSlot.start &&
                scheduleEnd === timeSlot.end &&
                s.week_type === "all"
            );
        });
    };

    return (
        <MenuLayout>
            <div className="p-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Расписание занятий
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl p-6 border border-gray-200">
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Группа
                                    </label>
                                    <div className="relative mb-4">
                                        <input
                                            type="text"
                                            placeholder="Поиск группы..."
                                            value={searchQuery}
                                            onChange={(e) =>
                                                setSearchQuery(e.target.value)
                                            }
                                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200
                                                        rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500
                                                        focus:border-transparent transition-all duration-200
                                                        placeholder:text-gray-400"
                                        />
                                        <Icon
                                            icon="mdi:magnify"
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
                                        />
                                    </div>

                                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                                        {groups
                                            ?.filter((group) =>
                                                group.name
                                                    .toLowerCase()
                                                    .includes(
                                                        searchQuery.toLowerCase()
                                                    )
                                            )
                                            .map((group) => (
                                                <button
                                                    key={group.id}
                                                    onClick={() =>
                                                        setSelectedGroup(group)
                                                    }
                                                    className={`w-full p-3 rounded-lg text-left transition-all ${
                                                        selectedGroup?.id ===
                                                        group.id
                                                            ? "bg-purple-100 border-purple-200 border-2"
                                                            : "bg-gray-50 border border-gray-200 hover:border-purple-200"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={`p-2 rounded-lg ${
                                                                selectedGroup?.id ===
                                                                group.id
                                                                    ? "bg-purple-200"
                                                                    : "bg-white"
                                                            }`}
                                                        >
                                                            <Icon
                                                                icon="mdi:account-group"
                                                                className={`text-xl ${
                                                                    selectedGroup?.id ===
                                                                    group.id
                                                                        ? "text-purple-600"
                                                                        : "text-gray-500"
                                                                }`}
                                                            />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900">
                                                                {group.name}
                                                            </div>
                                                            {group.speciality && (
                                                                <div className="text-sm text-gray-500">
                                                                    {
                                                                        group.speciality
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
                                <div className="flex flex-wrap gap-4 mb-6">
                                    <div className="flex gap-2 flex-wrap">
                                        {DAYS_OF_WEEK.map((day) => (
                                            <button
                                                key={day.id}
                                                onClick={() =>
                                                    setSelectedDay(day.id)
                                                }
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                                                    ${
                                                        selectedDay === day.id
                                                            ? "bg-purple-600 text-white"
                                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                            >
                                                {day.name}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        {WEEK_TYPES.map((type) => (
                                            <button
                                                key={type.id}
                                                onClick={() =>
                                                    setSelectedWeekType(type.id)
                                                }
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                                                    ${
                                                        selectedWeekType ===
                                                        type.id
                                                            ? "bg-purple-600 text-white"
                                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                            >
                                                {type.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {!selectedGroup ? (
                                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                                    <Icon
                                        icon="mdi:school-outline"
                                        className="text-6xl text-gray-300 mx-auto mb-4"
                                    />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Выберите группу
                                    </h3>
                                    <p className="text-gray-500">
                                        Для просмотра и редактирования
                                        расписания выберите группу
                                    </p>
                                </div>
                            ) : isLoadingSchedule ? (
                                <div className="text-center py-12">
                                    <Icon
                                        icon="mdi:loading"
                                        className="text-4xl text-purple-600 animate-spin mx-auto"
                                    />
                                    <p className="mt-2 text-gray-600">
                                        Загрузка расписания...
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {TIME_SLOTS.map((timeSlot, index) => {
                                        const lessonsInSlot = schedule?.filter(
                                            (s) => {
                                                const scheduleStart =
                                                    s.start_time.substring(
                                                        0,
                                                        5
                                                    );
                                                const scheduleEnd =
                                                    s.end_time.substring(0, 5);
                                                return (
                                                    scheduleStart ===
                                                        timeSlot.start &&
                                                    scheduleEnd === timeSlot.end
                                                );
                                            }
                                        );

                                        const conflictingLesson =
                                            checkTimeSlotConflict(timeSlot);

                                        return (
                                            <div
                                                key={index}
                                                className="bg-white rounded-xl p-6 border border-gray-200"
                                            >
                                                <div className="flex items-start gap-6">
                                                    <div className="w-32 flex-shrink-0">
                                                        <div className="text-lg font-semibold text-gray-900">
                                                            {timeSlot.start}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {timeSlot.end}
                                                        </div>
                                                    </div>

                                                    {lessonsInSlot?.length >
                                                    0 ? (
                                                        <div className="flex-1 space-y-3">
                                                            {lessonsInSlot.map(
                                                                (
                                                                    scheduleItem
                                                                ) => (
                                                                    <ScheduleItem
                                                                        key={
                                                                            scheduleItem.id
                                                                        }
                                                                        schedule={
                                                                            scheduleItem
                                                                        }
                                                                        onEdit={() =>
                                                                            handleEdit(
                                                                                scheduleItem
                                                                            )
                                                                        }
                                                                        onDelete={() =>
                                                                            handleDelete(
                                                                                scheduleItem
                                                                            )
                                                                        }
                                                                    />
                                                                )
                                                            )}
                                                        </div>
                                                    ) : conflictingLesson &&
                                                      selectedWeekType !==
                                                          "all" ? (
                                                        <div className="flex-1 p-4 border-2 border-dashed border-yellow-300 rounded-lg bg-yellow-50">
                                                            <div className="flex items-center gap-3 text-yellow-700">
                                                                <Icon
                                                                    icon="mdi:information"
                                                                    className="text-xl"
                                                                />
                                                                <span>
                                                                    Занятие уже
                                                                    назначено
                                                                    для всех
                                                                    недель:
                                                                    <br />
                                                                    {
                                                                        conflictingLesson
                                                                            .lesson
                                                                            .discipline
                                                                            .name
                                                                    }{" "}
                                                                    (
                                                                    {
                                                                        conflictingLesson
                                                                            .lesson
                                                                            .type
                                                                            .name
                                                                    }
                                                                    )
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() =>
                                                                handleAddLesson(
                                                                    timeSlot
                                                                )
                                                            }
                                                            disabled={
                                                                !!conflictingLesson
                                                            }
                                                            className={`flex-1 flex items-center justify-center p-4 border-2
                                                                border-dashed ${
                                                                    conflictingLesson
                                                                        ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                                                                        : "border-gray-300 hover:border-purple-300 hover:bg-purple-50"
                                                                } rounded-lg transition-all group`}
                                                        >
                                                            <div
                                                                className={`text-gray-400 ${
                                                                    !conflictingLesson &&
                                                                    "group-hover:text-purple-600"
                                                                }`}
                                                            >
                                                                <Icon
                                                                    icon="mdi:plus"
                                                                    className="text-2xl"
                                                                />
                                                                <span className="text-sm">
                                                                    Добавить
                                                                    занятие
                                                                </span>
                                                            </div>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showLessonModal && (
                <AddLessonModal
                    timeSlot={selectedTimeSlot}
                    group={selectedGroup}
                    dayOfWeek={selectedDay}
                    weekType={selectedWeekType}
                    teachers={teachers}
                    auditoriums={auditoriums}
                    onClose={() => {
                        setShowLessonModal(false);
                        setSelectedTimeSlot(null);
                    }}
                    onSubmit={(data) => {
                        createSchedule(
                            { ...data, week_type: selectedWeekType },
                            {
                                onSuccess: () => {
                                    setShowLessonModal(false);
                                    setSelectedTimeSlot(null);
                                    toast.success(
                                        "Занятие добавлено в расписание"
                                    );
                                },
                            }
                        );
                    }}
                    isLoading={isCreating}
                />
            )}

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-xl">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Удалить занятие
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Вы уверены, что хотите удалить это занятие?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={() => {
                                    deleteSchedule(selectedSchedule.id, {
                                        onSuccess: () => {
                                            setShowDeleteModal(false);
                                            setSelectedSchedule(null);
                                            toast.success("Занятие удалено");
                                        },
                                    });
                                }}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {isDeleting ? "Удаление..." : "Удалить"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && (
                <AddLessonModal
                    timeSlot={{
                        start: selectedSchedule.start_time.substring(0, 5),
                        end: selectedSchedule.end_time.substring(0, 5),
                    }}
                    group={selectedGroup}
                    dayOfWeek={selectedDay}
                    weekType={selectedWeekType}
                    teachers={teachers}
                    auditoriums={auditoriums}
                    initialData={selectedSchedule}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedSchedule(null);
                    }}
                    onSubmit={(data) => {
                        updateSchedule(
                            { id: selectedSchedule.id, data: data },
                            {
                                onSuccess: () => {
                                    setShowEditModal(false);
                                    setSelectedSchedule(null);
                                    toast.success("Занятие обновлено");
                                },
                            }
                        );
                    }}
                    isLoading={isUpdating}
                />
            )}
        </MenuLayout>
    );
}
