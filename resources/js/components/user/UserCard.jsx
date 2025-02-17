import { Icon } from "@iconify/react";
import UserInfoCard from "./UserInfoCard";

const UserCard = ({ userInfo, isStudent }) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
                    <Icon icon="mdi:account" className="text-white text-3xl" />
                </div>
                <div>
                    <h1 className="fs-4 mb-1">
                        {userInfo.name || "Пользователь"}
                    </h1>
                    <div className="d-flex align-items-center gap-2 text-muted">
                        <Icon icon="mdi:email" />
                        <span>{userInfo.email}</span>
                    </div>
                </div>
            </div>
            <hr className="my-4" />
            <div
                className={`grid ${
                    isStudent ? "grid-cols-3" : "grid-cols-2"
                } gap-4 `}
            >
                <UserInfoCard
                    title="Роль"
                    icon="mdi:shield-account"
                    value={userInfo.role?.name || "Не назначена"}
                />
                <UserInfoCard
                    title="Дата регистрации"
                    icon="mdi:clock"
                    value={new Date(userInfo.created_at).toLocaleDateString()}
                />
                {isStudent && (
                    <UserInfoCard
                        title="Группа"
                        icon="mdi:shield-account"
                        value={userInfo.group?.name || "Не назначена"}
                    />
                )}
            </div>
        </div>
    );
};

export default UserCard;
