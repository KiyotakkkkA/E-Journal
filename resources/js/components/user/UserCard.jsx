import { Icon } from "@iconify/react";
import UserInfoCard from "./UserInfoCard";
import { useAuth } from "../../contexts/AuthContext";

const UserCard = ({ userInfo }) => {
    const { roles } = useAuth();

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-start gap-6">
                <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md flex items-center justify-center">
                        <Icon
                            icon="mdi:account"
                            className="text-white text-4xl"
                        />
                    </div>
                    {userInfo?.email_verified_at && (
                        <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1.5 rounded-full shadow-sm">
                            <Icon icon="mdi:check" className="text-sm" />
                        </div>
                    )}
                </div>

                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {userInfo?.name || "Пользователь"}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-600">
                        <Icon icon="mdi:email" className="text-gray-400" />
                        <span>{userInfo?.email}</span>
                    </div>
                </div>
            </div>

            <div className="my-6 border-t border-gray-100" />

            <div
                className={`grid ${
                    roles.isStudent ? "grid-cols-3" : "grid-cols-2"
                } gap-6`}
            >
                <UserInfoCard
                    title="Роль"
                    icon="mdi:shield-account"
                    value={userInfo?.role?.name || "Не назначена"}
                    color="purple"
                />
                <UserInfoCard
                    title="Дата регистрации"
                    icon="mdi:clock"
                    value={new Date(userInfo?.created_at).toLocaleDateString()}
                    color="blue"
                />
                {roles.isStudent && (
                    <UserInfoCard
                        title="Группа"
                        icon="mdi:account-group"
                        value={userInfo?.group?.name || "Не назначена"}
                        color="green"
                    />
                )}
            </div>
        </div>
    );
};

export default UserCard;
