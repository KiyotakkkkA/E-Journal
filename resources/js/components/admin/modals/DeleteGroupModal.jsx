import React from "react";
import { Icon } from "@iconify/react";

const DeleteGroupModal = ({ group, isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50
                      flex items-center justify-center p-4"
        >
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div className="p-6">
                    <div className="flex items-center justify-center mb-4">
                        <div
                            className="w-12 h-12 rounded-full bg-red-100
                                    flex items-center justify-center"
                        >
                            <Icon
                                icon="mdi:alert"
                                className="text-2xl text-red-600"
                            />
                        </div>
                    </div>

                    <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                        Удаление группы
                    </h3>

                    <p className="text-sm text-gray-500 text-center mb-6">
                        Вы уверены, что хотите удалить группу "{group?.name}"?
                        Это действие нельзя будет отменить.
                    </p>

                    <div className="flex gap-3 justify-between">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700
                                     bg-white border border-gray-300 rounded-lg
                                     hover:bg-gray-50 transition-colors duration-200"
                        >
                            Отмена
                        </button>
                        <button
                            onClick={() => {
                                onConfirm(group.id);
                                onClose();
                            }}
                            className="px-4 py-2 text-sm font-medium text-white
                                     bg-red-600 rounded-lg hover:bg-red-700
                                     transition-colors duration-200"
                        >
                            Удалить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteGroupModal;
