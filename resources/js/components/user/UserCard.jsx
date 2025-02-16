import { Icon } from "@iconify/react";
import UserInfoCard from "./UserInfoCard";

const UserCard = ({ userInfo, isStudent }) => {
    return (
        <div className="card p-4 shadow-sm">
            <div className="d-flex align-items-center gap-4">
                <div className="bg-purple rounded-circle p-4">
                    <Icon icon="mdi:account" className="text-white fs-1" />
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
            <div className="row g-3">
                <UserInfoCard
                    title="Роль"
                    icon="mdi:shield-account"
                    value={userInfo.role?.name || "Не назначена"}
                    colSize={isStudent ? 4 : 6}
                />
                <UserInfoCard
                    title="Дата регистрации"
                    icon="mdi:clock"
                    value={new Date(userInfo.created_at).toLocaleDateString()}
                    colSize={isStudent ? 4 : 6}
                />
                {isStudent && (
                    <UserInfoCard
                        title="Группа"
                        icon="mdi:shield-account"
                        value={userInfo.group?.name || "Не назначена"}
                        colSize={4}
                    />
                )}
            </div>
        </div>
    );
};

export default UserCard;
