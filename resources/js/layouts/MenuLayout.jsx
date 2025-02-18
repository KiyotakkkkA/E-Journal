import React from "react";
import MainMenu from "../components/MainMenu";

const MenuLayout = ({ children }) => {
    return (
        <div className="flex gap-1">
            <div className="w-30">
                <MainMenu />
            </div>
            <div className="w-75 m-4">{children}</div>
        </div>
    );
};

export default MenuLayout;
