import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

export const ServiceCard = ({ service }) => {
    const { title, description, icon, ref, color, badge, badgeContent } =
        service;

    return (
        <Link
            to={ref}
            className="group relative bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-purple-200 overflow-hidden"
        >
            <div
                className="absolute -right-8 -top-8 w-24 h-24 rounded-full transition-transform duration-500 group-hover:scale-150 opacity-10"
                style={{ backgroundColor: color }}
            />

            <div className="relative">
                <div
                    className="inline-flex p-3 rounded-xl mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{
                        backgroundColor: `${color}15`,
                        color: color,
                    }}
                >
                    <Icon icon={icon} className="text-2xl" />
                </div>

                {badge && (
                    <div
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white animate-pulse"
                        style={{ backgroundColor: color }}
                    >
                        {badgeContent}
                    </div>
                )}

                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-600">{description}</p>
                </div>

                <div className="mt-4 flex items-center text-sm font-medium text-gray-600 group-hover:text-purple-600 transition-colors duration-300">
                    <span>Перейти</span>
                    <Icon
                        icon="mdi:arrow-right"
                        className="ml-1 text-base transition-transform duration-300 group-hover:translate-x-1"
                    />
                </div>
            </div>
        </Link>
    );
};
