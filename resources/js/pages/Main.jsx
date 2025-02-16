import React from "react";
import MenuLayout from "../layouts/MenuLayout";

const Main = ({ canViewAdminPanel }) => {
    return (
        <MenuLayout canViewAdminPanel={canViewAdminPanel}>
            <div>Main</div>
        </MenuLayout>
    );
};

export default Main;
