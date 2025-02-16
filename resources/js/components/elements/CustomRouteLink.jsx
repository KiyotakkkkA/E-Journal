import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";

const CustomRouteLink = ({ to, children, className, icon }) => {
    const currentPath = useLocation().pathname;
    return (
        <Link
            to={to}
            className={`custom-link d-flex align-items-center gap-2 ${className} ${
                currentPath === to ? "link-active" : ""
            }`}
        >
            <Icon icon={icon} width={20} />
            {children}
        </Link>
    );
};

export default CustomRouteLink;
