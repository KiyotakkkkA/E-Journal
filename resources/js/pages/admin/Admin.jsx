import React, { useState, useEffect } from "react";
import MenuLayout from "../../layouts/MenuLayout";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import axios from "../../axios";
const Admin = ({ canViewAdminPanel }) => {
    const [requestsCount, setRequestsCount] = useState(0);

    const services = [
        {
            title: "Группы",
            description:
                "Создание новой учебной группы и настройка её параметров",
            icon: "mdi:account-group",
            ref: "/admin/groups",
            color: "#4CAF50",
        },
        {
            title: "Заявки на прикрепление",
            description: "Управление заявками на прикрепление к группам",
            icon: "mdi:file-document-edit",
            ref: "/admin/requests",
            color: "#2196F3",
            badge: requestsCount > 0,
            badgeContent: requestsCount,
        },
        {
            title: "Изменить расписание",
            description: "Редактирование расписания занятий для групп",
            icon: "mdi:calendar-edit",
            ref: "/admin/schedule",
            color: "#9C27B0",
        },
    ];

    useEffect(() => {
        axios.get("/api/admin/requests").then((res) => {
            setRequestsCount(res.data.requestsCount);
        });
    }, []);

    return (
        <MenuLayout canViewAdminPanel={canViewAdminPanel}>
            <div className="container py-4">
                <div className="row g-4">
                    {services.map((service, index) => (
                        <div key={index} className="col-md-6 col-lg-4">
                            <div className="service-card">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div
                                        className="service-icon"
                                        style={{
                                            backgroundColor: service.color,
                                        }}
                                    >
                                        <Icon
                                            icon={service.icon}
                                            width="32"
                                            height="32"
                                            color="white"
                                        />
                                    </div>
                                    {service.badge && (
                                        <span className="badge bg-danger rounded-pill">
                                            {service.badgeContent}
                                        </span>
                                    )}
                                </div>
                                <h3 className="service-title">
                                    {service.title}
                                </h3>
                                <p className="service-description">
                                    {service.description}
                                </p>
                                <Link
                                    to={service.ref}
                                    className="btn btn-purple w-100"
                                >
                                    Перейти
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </MenuLayout>
    );
};

export default Admin;
