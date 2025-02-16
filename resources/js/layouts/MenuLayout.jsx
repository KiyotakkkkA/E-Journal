import React from "react";
import MainMenu from "../components/MainMenu";

const MenuLayout = ({ children, canViewAdminPanel }) => {
    return (
        <div className="d-flex gap-3">
            <div className="w-10">
                <MainMenu canViewAdminPanel={canViewAdminPanel} />
            </div>
            <div className="w-75 m-3">{children}</div>
        </div>
    );
};

export default MenuLayout;
