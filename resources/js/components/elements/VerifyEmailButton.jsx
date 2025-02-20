import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useSendVerificationEmail } from "../../scripts/hooks/useUserQueries";
import { useAuth } from "../../contexts/AuthContext";
import VerificationModal from "../common/modals/VerificationModal";
export default function VerifyEmailButton() {
    const { roles, hasVerifiedEmail } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { mutate: sendVerificationEmail, isPending: isSending } =
        useSendVerificationEmail();

    if (!roles.isGuest && !(roles.isTeacher && !hasVerifiedEmail)) return null;

    return (
        <>
            <button
                onClick={() => {
                    sendVerificationEmail(null, {
                        onSuccess: () => setIsModalOpen(true),
                    });
                }}
                disabled={isSending}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-200 disabled:opacity-50 transition-all"
            >
                <Icon icon="mdi:email-check" className="text-xl" />
                {isSending ? "Отправка..." : "Подтвердить email"}
            </button>

            <VerificationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
