import { Icon } from "@iconify/react";

const RequestCard = ({ request, status }) => {
    const statusConfig = {
        pending: {
            icon: "mdi:clock-outline",
            color: "text-yellow-600",
            text: "В обработке",
            bgColor: "bg-yellow-50",
        },
        approved: {
            icon: "mdi:check-circle-outline",
            color: "text-green-600",
            text: "Одобрено",
            bgColor: "bg-green-50",
        },
        rejected: {
            icon: "mdi:close-circle-outline",
            color: "text-red-600",
            text: "Отклонено",
            bgColor: "bg-red-50",
        },
    };

    const config = statusConfig[status];

    return (
        <div className={`p-4 rounded-lg ${config.bgColor} mr-3`}>
            <div className="flex justify-between items-start mb-3 gap-2">
                <h6 className="text-sm font-medium text-gray-600">
                    Заявка на зачисление
                </h6>
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${config.bgColor} ${config.color}`}
                >
                    <Icon icon={config.icon} className="mr-1" />
                    {config.text}
                </span>
            </div>
            <div className="mb-2 text-sm">
                <span className="font-medium">ФИО: </span>
                {request.name}
            </div>
            <div className="text-sm">
                <span className="font-medium">Группа: </span>
                {request.group.name}
            </div>
        </div>
    );
};

const StudentRequests = ({ requests }) => {
    return (
        <div className="mt-4">
            {Object.entries(requests).map(
                ([status, requestList]) =>
                    requestList.length > 0 && (
                        <div key={status} className="mb-4">
                            <h5 className="text-lg font-medium text-gray-800 mb-3">
                                {status === "pending" && "Активные заявки"}
                                {status === "approved" && "Одобренные заявки"}
                                {status === "rejected" && "Отклоненные заявки"}
                            </h5>
                            <div className="flex flex-wrap gap-3">
                                {requestList.map((request) => (
                                    <RequestCard
                                        key={request.id}
                                        request={request}
                                        status={status}
                                    />
                                ))}
                            </div>
                        </div>
                    )
            )}
        </div>
    );
};

export default StudentRequests;
