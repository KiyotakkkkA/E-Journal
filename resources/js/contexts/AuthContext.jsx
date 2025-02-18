import React, { createContext, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children, auth }) {
    const value = {
        isAuthenticated: auth.isAuthenticated,
        canViewAdminPanel: auth.canViewAdminPanel,
        roles: {
            isStudent: auth.roles?.isStudent,
            isTeacher: auth.roles?.isTeacher,
            isAdmin: auth.roles?.isAdmin,
            isEmailVerified: auth.roles?.isEmailVerified,
            isGuest: auth.roles?.isGuest,
        },
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
