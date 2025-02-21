import React from "react";
import { Icon } from "@iconify/react";

export default function DeleteConfirmationModal({
    title,
    message,
    onConfirm,
    onCancel,
    isLoading,
}) {
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="fixed inset-0 bg-black opacity-30"></div>
                <div className="relative bg-white rounded-lg p-8 max-w-lg w-full">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        {title}
                    </h2>
                    <p className="text-gray-600 mb-6">{message}</p>
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 text-gray-600 hover:text-gray-700 transition-colors"
                            disabled={isLoading}
                        >
                            Отмена
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            disabled={isLoading}
                        >
                            {isLoading ? "Удаление..." : "Удалить"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
