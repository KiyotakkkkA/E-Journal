import React from "react";
import MenuLayout from "../layouts/MenuLayout";
import UserInfo from "../components/UserInfo";
const UserPage = ({ canViewAdminPanel, isStudent }) => {
    return (
        <MenuLayout canViewAdminPanel={canViewAdminPanel}>
            <UserInfo isStudent={isStudent} />
        </MenuLayout>
    );
};

export default UserPage;
