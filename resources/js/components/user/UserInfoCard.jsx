import { Icon } from "@iconify/react";

const UserInfoCard = ({ title, icon, value }) => {
    return (
        <div className="bg-gray-100 rounded-lg p-4 transition-all duration-200 hover:bg-gray-200">
            <div className="flex items-center gap-3 mb-2">
                <Icon icon={icon} className="text-purple-600 text-xl" />
                <h3 className="text-sm font-medium text-gray-600">{title}</h3>
            </div>
            <p className="text-gray-800 font-medium pl-8">{value}</p>
        </div>
    );
};

export default UserInfoCard;
