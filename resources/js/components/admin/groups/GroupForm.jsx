import React from "react";

const GroupForm = ({ newGroup, setNewGroup, errors, onSubmit, onCancel }) => {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Название группы
                </label>
                <input
                    type="text"
                    id="name"
                    value={newGroup.name}
                    onChange={(e) =>
                        setNewGroup({ ...newGroup, name: e.target.value })
                    }
                    className={`
                        w-full px-4 py-2 bg-white border rounded-lg
                        text-gray-900 text-sm focus:ring-2 focus:ring-purple-600
                        transition-colors duration-200
                        ${errors.name ? "border-red-300" : "border-gray-300"}
                    `}
                    placeholder="Введите название группы"
                />
                {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
            </div>

            <div>
                <label
                    htmlFor="max_students"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Максимальное количество студентов
                </label>
                <input
                    type="number"
                    id="max_students"
                    min="1"
                    value={newGroup.max_students}
                    onChange={(e) =>
                        setNewGroup({
                            ...newGroup,
                            max_students: parseInt(e.target.value),
                        })
                    }
                    className={`
                        w-full px-4 py-2 bg-white border rounded-lg
                        text-gray-900 text-sm focus:ring-2 focus:ring-purple-600
                        transition-colors duration-200
                        ${
                            errors.max_students
                                ? "border-red-300"
                                : "border-gray-300"
                        }
                    `}
                />
                {errors.max_students && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.max_students}
                    </p>
                )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700
                             bg-white border border-gray-300 rounded-lg
                             hover:bg-gray-50 focus:outline-none focus:ring-2
                             focus:ring-offset-2 focus:ring-purple-500
                             transition-colors duration-200"
                >
                    Отмена
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white
                             bg-purple-600 rounded-lg hover:bg-purple-700
                             focus:outline-none focus:ring-2 focus:ring-offset-2
                             focus:ring-purple-500 transition-colors duration-200"
                >
                    Создать группу
                </button>
            </div>
        </form>
    );
};

export default GroupForm;
