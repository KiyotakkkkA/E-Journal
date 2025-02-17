import { Icon } from "@iconify/react";
import { useEffect } from "react";

const GroupStudentsModal = ({ group, students, onClose, isOpen }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50
                      flex items-center justify-center p-4"
        >
            <div
                className="bg-white rounded-xl shadow-xl w-full max-w-4xl
                          max-h-[90vh] flex flex-col"
            >
                <div
                    className="flex items-center justify-between px-6 py-4
                             border-b border-gray-200"
                >
                    <h3 className="text-xl font-semibold text-gray-900">
                        Студенты группы {group.name}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500
                                 transition-colors duration-200"
                    >
                        <Icon icon="mdi:close" className="text-xl" />
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-6">
                    {students.length === 0 ? (
                        <div className="text-center py-12">
                            <Icon
                                icon="mdi:account-group-outline"
                                className="mx-auto h-12 w-12 text-gray-400"
                            />
                            <p className="mt-2 text-sm text-gray-500">
                                В этой группе пока нет студентов
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            №
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Код студента
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ФИО
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Дата зачисления
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {students.map((student, index) => (
                                        <tr
                                            key={student.id}
                                            className="hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <code className="px-2 py-1 bg-gray-100 rounded-md text-sm font-mono text-gray-800">
                                                    {student.student_code}
                                                </code>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {student.user.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {student.user.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(
                                                    student.created_at
                                                ).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div
                    className="px-6 py-4 border-t border-gray-200
                             bg-gray-50 rounded-b-xl"
                >
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-4 py-2 bg-white border
                                 border-gray-300 rounded-lg text-sm font-medium
                                 text-gray-700 hover:bg-gray-50
                                 transition-colors duration-200"
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GroupStudentsModal;
