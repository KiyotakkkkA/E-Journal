import React, { useEffect } from "react";
import CustomRouteLink from "./elements/CustomRouteLink";
import { useAuth } from "../contexts/AuthContext";
import { observer } from "mobx-react-lite";
import { notificationsStore } from "../stores/notificationsStore";
import { useNotifications } from "../scripts/hooks/useRealTimeQueries";
import { useSyncData } from "../scripts/hooks/common";

const MainMenu = observer(() => {
    const { canViewAdminPanel, roles } = useAuth();
    const requestsCount = notificationsStore.getRequestsCount();
    const messagesCount = notificationsStore.getMessagesCount();
    const syncData = useSyncData();

    const { data } = useNotifications();

    useEffect(() => {
        if (data) {
            syncData(data, "notifications", false, notificationsStore);
        }
    }, [data]);

    return (
        <aside className="h-screen w-64 bg-white border-r border-gray-200">
            <div className="p-4">
                <nav className="space-y-1">
                    {(roles.isStudent || roles.isTeacher || roles.isAdmin) && (
                        <CustomRouteLink
                            to="/"
                            icon="mdi:home"
                            className="flex items-center w-full px-4 py-2.5 text-gray-600 rounded-lg
                                 hover:bg-purple-50 hover:text-purple-600
                                 transition-all duration-200 group"
                            activeClassName="bg-purple-100 text-purple-600 font-medium"
                        >
                            <div className="flex items-center justify-between w-full">
                                <span className="text-sm">Главная</span>
                                {messagesCount > 0 && (
                                    <span className="text-xs text-gray-500 bg-purple-100 rounded-full px-2 py-1">
                                        {messagesCount}
                                    </span>
                                )}
                            </div>
                        </CustomRouteLink>
                    )}

                    <CustomRouteLink
                        to="/user"
                        icon="mdi:account"
                        className="flex items-center w-full px-4 py-2.5 text-gray-600 rounded-lg
                                 hover:bg-purple-50 hover:text-purple-600
                                 transition-all duration-200 group"
                        activeClassName="bg-purple-100 text-purple-600 font-medium"
                    >
                        <span className="text-sm">Профиль</span>
                    </CustomRouteLink>

                    {(roles.isStudent || roles.isTeacher || roles.isAdmin) && (
                        <CustomRouteLink
                            to="/services"
                            icon="mdi:account-group"
                            className="flex items-center w-full px-4 py-2.5 text-gray-600 rounded-lg
                                 hover:bg-purple-50 hover:text-purple-600
                                 transition-all duration-200 group"
                            activeClassName="bg-purple-100 text-purple-600 font-medium"
                        >
                            <span className="text-sm">Сервисы</span>
                        </CustomRouteLink>
                    )}

                    {canViewAdminPanel && (
                        <CustomRouteLink
                            to="/admin"
                            icon="mdi:security"
                            className="flex items-center w-full px-4 py-2.5 text-gray-600 rounded-lg
                                     hover:bg-purple-50 hover:text-purple-600
                                     transition-all duration-200 group"
                            activeClassName="bg-purple-100 text-purple-600 font-medium"
                        >
                            <div className="flex items-center justify-between w-full">
                                <span className="text-sm">Админ-панель</span>
                                {requestsCount > 0 && (
                                    <span className="text-xs text-gray-500 bg-purple-100 rounded-full px-2 py-1">
                                        {requestsCount}
                                    </span>
                                )}
                            </div>
                        </CustomRouteLink>
                    )}
                </nav>
            </div>
        </aside>
    );
});

export default MainMenu;
