import { Icon } from "@iconify/react";

export const Stairs = () => (
    <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow">
        <Icon icon="mdi:stairs" className="text-2xl text-gray-500" />
    </div>
);

export const Elevator = () => (
    <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow">
        <Icon icon="mdi:elevator" className="text-2xl text-gray-500" />
    </div>
);

export const RestRoom = () => (
    <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow">
        <Icon icon="mdi:paper-roll" className="text-2xl text-gray-500" />
    </div>
);
