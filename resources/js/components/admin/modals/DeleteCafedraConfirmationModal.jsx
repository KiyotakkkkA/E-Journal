import React from "react";
import { Icon } from "@iconify/react";

export default function DeleteCafedraConfirmationModal({
    title,
    message,
    onConfirm,
    onCancel,
    isLoading,
}) {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        {title}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <Icon icon="mdi:close" className="text-2xl" />
                    </button>
                </div>

                <p className="text-gray-600 mb-8">{message}</p>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                    >
                        Отмена
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-6 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all"
                    >
                        {isLoading ? "Удаление..." : "Удалить"}
                    </button>
                </div>
            </div>
        </div>
    );
}
