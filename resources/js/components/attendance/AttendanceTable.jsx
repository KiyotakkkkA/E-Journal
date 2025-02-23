import React, { useState } from "react";
import {
    useAttendance,
    useUpdateAttendance,
} from "../../scripts/hooks/useAttendanceQueries";
import AnimatedLoader from "../elements/AnimatedLoader";
import { Icon } from "@iconify/react";

const ATTENDANCE_STATUSES = {
    present: {
        label: "+",
        title: "Присутствовал",
        className: "bg-green-100 text-green-700",
        activeClassName: "bg-green-600 text-white",
    },
    absent: {
        label: "Н",
        title: "Не был",
        className: "bg-red-100 text-red-700",
        activeClassName: "bg-red-600 text-white",
    },
    late: {
        label: "О",
        title: "Опоздал",
        className: "bg-yellow-100 text-yellow-700",
        activeClassName: "bg-yellow-600 text-white",
    },
    excused: {
        label: "У",
        title: "Уважительная причина",
        className: "bg-blue-100 text-blue-700",
        activeClassName: "bg-blue-600 text-white",
    },
};

const LESSON_TYPES = {
    lecture: "Лекция",
    seminar: "Семинар",
    practice: "Практика",
    lab: "Лабораторная",
};

export default function AttendanceTable({ groupId, date, canManage }) {
    const {
        data: attendance,
        isLoading,
        mutate,
    } = useAttendance(groupId, date);
    const { mutate: updateAttendance } = useUpdateAttendance();
    const [localChanges, setLocalChanges] = useState({});

    const handleAttendanceChange = (studentId, lessonId, status) => {
        if (!canManage) return;

        const key = `${studentId}-${lessonId}`;
        setLocalChanges((prev) => ({
            ...prev,
            [key]: status,
        }));

        updateAttendance({
            student_id: studentId,
            lesson_id: lessonId,
            status: status,
            date: date.toISOString().split("T")[0],
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <AnimatedLoader className="w-8 h-8" />
            </div>
        );
    }

    if (!attendance?.lessons?.length) {
        return (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Icon
                    icon="mdi:calendar-blank"
                    className="text-4xl text-gray-300 mb-3 mx-auto"
                />
                <p className="text-gray-500">На выбранную дату нет занятий</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full">
                <thead>
                    <tr className="bg-gray-50/50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 w-12 border-b border-gray-200">
                            №
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-200">
                            Студент
                        </th>
                        {attendance.lessons.map((lesson) => (
                            <th
                                key={lesson.id}
                                className="px-4 py-3 text-center border-b border-gray-200"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-sm font-medium text-gray-700">
                                        {lesson.discipline.name}
                                    </span>
                                    {lesson.week_type !== "all" && (
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                                            {lesson.week_type === "even"
                                                ? "Чётная"
                                                : "Нечётная"}
                                        </span>
                                    )}
                                </div>
                                <div className="mt-1.5 flex flex-col gap-0.5">
                                    <span className="text-xs font-medium text-gray-500">
                                        {LESSON_TYPES[lesson.type]}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {lesson.time}
                                    </span>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {attendance.students.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50/50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-400">
                                {student.number}
                            </td>
                            <td className="px-4 py-3">
                                <span className="text-sm font-medium text-gray-900">
                                    {student.name}
                                </span>
                            </td>
                            {attendance.lessons.map((lesson) => {
                                const key = `${student.id}-${lesson.id}`;
                                const attendanceRecord = attendance.data.find(
                                    (a) =>
                                        a.student_id === student.id &&
                                        a.lesson_id === lesson.id
                                );
                                const status =
                                    localChanges[key] ||
                                    attendanceRecord?.status ||
                                    "absent";

                                return (
                                    <td
                                        key={`${student.id}-${lesson.id}`}
                                        className="px-4 py-3"
                                    >
                                        {canManage ? (
                                            <div className="flex gap-1.5 justify-center">
                                                {Object.entries(
                                                    ATTENDANCE_STATUSES
                                                ).map(([value, info]) => (
                                                    <button
                                                        key={value}
                                                        onClick={() =>
                                                            handleAttendanceChange(
                                                                student.id,
                                                                lesson.id,
                                                                value
                                                            )
                                                        }
                                                        className={`w-8 h-8 rounded-full text-sm font-medium shadow-sm transition-all ${
                                                            status === value
                                                                ? info.activeClassName +
                                                                  " ring-2 ring-offset-2 ring-opacity-50 " +
                                                                  info.className.replace(
                                                                      "bg-",
                                                                      "ring-"
                                                                  )
                                                                : info.className
                                                        } hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
                                                        title={info.title}
                                                    >
                                                        {info.label}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex justify-center">
                                                <span
                                                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${ATTENDANCE_STATUSES[status].className}`}
                                                    title={
                                                        ATTENDANCE_STATUSES[
                                                            status
                                                        ].title
                                                    }
                                                >
                                                    {
                                                        ATTENDANCE_STATUSES[
                                                            status
                                                        ].label
                                                    }
                                                </span>
                                            </div>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
