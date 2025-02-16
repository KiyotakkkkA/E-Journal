import React from "react";
import CustomRouteLink from "./elements/CustomRouteLink";
const MainMenu = ({ canViewAdminPanel }) => {
    return (
        <div className="bg-light p-3 container card m-3">
            <div className="d-flex flex-column gap-3">
                <CustomRouteLink to="/" icon="mdi:home">
                    Главная
                </CustomRouteLink>
                <CustomRouteLink to="/user" icon="mdi:account">
                    Профиль
                </CustomRouteLink>
                {canViewAdminPanel && (
                    <CustomRouteLink to="/admin" icon="mdi:security">
                        Админ-панель
                    </CustomRouteLink>
                )}
            </div>
        </div>
    );
};

export default MainMenu;
