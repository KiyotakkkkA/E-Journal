import { Icon } from "@iconify/react";

const UserInfoCard = ({ title, icon, value, color = "purple" }) => {
    const colors = {
        purple: "bg-purple-50 text-purple-600",
        blue: "bg-blue-50 text-blue-600",
        green: "bg-green-50 text-green-600",
    };

    return (
        <div className="bg-white rounded-lg border border-gray-100 p-4 hover:border-gray-200 transition-all duration-200">
            <div className="flex items-start gap-3">
                <div
                    className={`p-2 rounded-lg ${colors[color]} bg-opacity-20`}
                >
                    <Icon icon={icon} className="text-xl" />
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                        {title}
                    </h3>
                    <p className="text-base font-semibold text-gray-900">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserInfoCard;
