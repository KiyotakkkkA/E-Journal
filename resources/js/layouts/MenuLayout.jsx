import React from "react";
import MainMenu from "../components/MainMenu";

const MenuLayout = ({ children }) => {
    return (
        <div className="flex">
            <div className="w-64 min-h-screen bg-gray-50 border-r">
                <MainMenu />
            </div>
            <div className="flex-1">{children}</div>
        </div>
    );
};

export default MenuLayout;
