import React from "react";
import CustomRouteLink from "./elements/CustomRouteLink";
import { useAuth } from "../contexts/AuthContext";

const MainMenu = () => {
    const { canViewAdminPanel, roles } = useAuth();

    return (
        <aside className="h-screen w-64 bg-white border-r border-gray-200">
            <div className="p-4">
                <nav className="space-y-1">
                    <CustomRouteLink
                        to="/"
                        icon="mdi:home"
                        className="flex items-center w-full px-4 py-2.5 text-gray-600 rounded-lg
                                 hover:bg-purple-50 hover:text-purple-600
                                 transition-all duration-200 group"
                        activeClassName="bg-purple-100 text-purple-600 font-medium"
                    >
                        <span className="text-sm">Главная</span>
                    </CustomRouteLink>

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
                            <span className="text-sm">Админ-панель</span>
                        </CustomRouteLink>
                    )}
                </nav>
            </div>
        </aside>
    );
};

export default MainMenu;
