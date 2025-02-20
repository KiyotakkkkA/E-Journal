import { useState } from "react";
import { useVerifyEmail } from "../../../scripts/hooks/useUserQueries";
import { Icon } from "@iconify/react";

const VerificationModal = ({ isOpen, onClose }) => {
    const [code, setCode] = useState("");
    const { mutate: verifyEmail, isPending } = useVerifyEmail();

    const handleSubmit = (e) => {
        e.preventDefault();
        verifyEmail(code, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-xl animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Подтверждение email
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <Icon icon="mdi:close" className="text-2xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Код подтверждения
                        </label>
                        <input
                            type="text"
                            placeholder="Введите код из письма"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-400 transition-all"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            maxLength={6}
                        />
                        <p className="mt-2 text-sm text-gray-500">
                            Проверьте ваш почтовый ящик. Мы отправили вам код
                            подтверждения.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={isPending || code.length !== 6}
                            className="px-6 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isPending ? (
                                <div className="flex items-center gap-2">
                                    <Icon
                                        icon="mdi:loading"
                                        className="animate-spin"
                                    />
                                    Проверка...
                                </div>
                            ) : (
                                "Подтвердить"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerificationModal;
