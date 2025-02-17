import React from "react";
import { Icon } from "@iconify/react";

const InputWithIcon = ({
    icon,
    type,
    id,
    placeholder,
    value,
    onChange,
    error,
    autoComplete,
    appendContent,
}) => {
    return (
        <div className="relative">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon icon={icon} className="h-5 w-5 text-purple-600" />
                </div>

                <input
                    type={type}
                    id={id}
                    className={`
                        w-full py-2.5 pl-10 pr-10
                        text-gray-900 text-sm
                        bg-gray-50
                        rounded-lg
                        focus:ring-1
                        focus:ring-purple-600
                        focus:border-purple-600
                        hover:outline-purple-300
                        outline-none
                        ${error ? "border-red-600" : "border-gray-300"}
                        transition-border
                        duration-300
                        fs-6
                    `}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    autoComplete={autoComplete}
                />

                {error && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center ">
                        <div className="relative group">
                            <Icon
                                icon="mdi:alert-circle"
                                className="h-5 w-5 text-red-500 cursor-help"
                            />
                        </div>
                    </div>
                )}
            </div>
            {error && (
                <div className="mt-1 text-right text-red-600 text-xs">
                    {error}
                </div>
            )}

            {appendContent && (
                <div className="mt-1 text-right">{appendContent}</div>
            )}
        </div>
    );
};

export default InputWithIcon;
