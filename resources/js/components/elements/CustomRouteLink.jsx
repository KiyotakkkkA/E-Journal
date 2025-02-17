import React from "react";
import { Icon } from "@iconify/react";
import { Link, useLocation } from "react-router-dom";

const CustomRouteLink = ({
    to,
    icon,
    children,
    className = "",
    activeClassName = "",
}) => {
    const location = useLocation();
    const isActive =
        to === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(to);

    return (
        <Link
            to={to}
            className={`
                relative
                ${className}
                ${isActive ? activeClassName : ""}
            `}
        >
            <Icon
                icon={icon}
                className={`
                    h-5 w-5 mr-3
                    transition-all duration-200
                    group-hover:scale-110
                    ${isActive ? "text-purple-600" : "text-gray-400"}
                `}
            />
            {children}

            {isActive && (
                <div className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-r-full" />
            )}
        </Link>
    );
};

export default CustomRouteLink;
