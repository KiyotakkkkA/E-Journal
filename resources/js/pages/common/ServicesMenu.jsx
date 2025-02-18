import React, { useEffect } from "react";
import MenuLayout from "../../layouts/MenuLayout";
import { ServiceCard } from "../../components/common/ServiceCard";
import { useAuth } from "../../contexts/AuthContext";

const servicesTextForRoles = {
    isAdmin: {
        groups: {
            description:
                "Создание новой учебной группы и настройка её параметров",
        },
    },
    isTeacher: {
        groups: {
            description: "Просмотр учебных групп по вашим дисциплинам",
        },
    },
    isStudent: {
        groups: {
            description: "Просмотр вашей учебной группы",
        },
    },
};

const descriptionDecoder = (service) => {
    const { roles } = useAuth();
    for (const role in roles) {
        if (roles[role]) {
            return servicesTextForRoles[role][service].description;
        }
    }
};

const ServicesMenu = () => {
    const services = [
        {
            title: "Группы",
            description: descriptionDecoder("groups"),
            icon: "mdi:account-group",
            ref: "/services/groups",
            color: "#4CAF50",
        },
    ];

    return (
        <MenuLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <ServiceCard key={index} service={service} />
                    ))}
                </div>
            </div>
        </MenuLayout>
    );
};

export default ServicesMenu;
