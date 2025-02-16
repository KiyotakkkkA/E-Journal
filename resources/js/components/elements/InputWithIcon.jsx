import React, { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { Tooltip } from "bootstrap";

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
    const iconContainerRef = useRef(null);
    const tooltipInstance = useRef(null);

    useEffect(() => {
        if (tooltipInstance.current) {
            tooltipInstance.current.dispose();
            tooltipInstance.current = null;
        }

        if (error && iconContainerRef.current) {
            tooltipInstance.current = new Tooltip(iconContainerRef.current);
        }

        return () => {
            if (tooltipInstance.current) {
                tooltipInstance.current.dispose();
                tooltipInstance.current = null;
            }
        };
    }, [error]);

    return (
        <div className="mb-3 position-relative">
            <div className="position-relative d-flex align-items-center">
                <Icon
                    icon={icon}
                    className="text-purple bg-gray position-absolute top-50 start-0 translate-middle-y fs-1 ps-2"
                />
                <input
                    type={type}
                    className={`form-control no-border ps-5 ${
                        error ? "border-danger border-1" : ""
                    }`}
                    id={id}
                    placeholder={placeholder}
                    required
                    value={value}
                    onChange={onChange}
                    autoComplete={autoComplete}
                />
                {error && (
                    <div
                        ref={iconContainerRef}
                        className="position-absolute top-50 end-0 translate-middle-y me-2"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title={error}
                    >
                        <Icon
                            icon="mdi:alert-circle"
                            className="text-danger"
                            style={{ fontSize: "1.2rem" }}
                        />
                    </div>
                )}
            </div>
            {appendContent && <span>{appendContent}</span>}
        </div>
    );
};

export default InputWithIcon;
