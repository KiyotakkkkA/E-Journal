import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

const EditGroupModal = ({ group, isOpen, onClose, onSave }) => {
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (group) {
            setName(group.name);
        }
    }, [group]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError("Название группы не может быть пустым");
            return;
        }

        onSave({ ...group, name: name.trim() });
        onClose();
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50
                      flex items-center justify-center p-4"
        >
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div
                    className="flex items-center justify-between px-6 py-4
                             border-b border-gray-200"
                >
                    <h3 className="text-lg font-medium text-gray-900">
                        Редактирование группы
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500
                                 transition-colors duration-200"
                    >
                        <Icon icon="mdi:close" className="text-xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-4">
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Название группы
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setError("");
                            }}
                            className={`
                                w-full px-4 py-2 bg-white border rounded-lg
                                text-gray-900 text-sm focus:ring-2 focus:ring-purple-600
                                transition-colors duration-200
                                ${error ? "border-red-300" : "border-gray-300"}
                            `}
                        />
                        {error && (
                            <p className="mt-1 text-sm text-red-600">{error}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700
                                     bg-white border border-gray-300 rounded-lg
                                     hover:bg-gray-50 transition-colors duration-200"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white
                                     bg-purple-600 rounded-lg hover:bg-purple-700
                                     transition-colors duration-200"
                        >
                            Сохранить
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditGroupModal;
