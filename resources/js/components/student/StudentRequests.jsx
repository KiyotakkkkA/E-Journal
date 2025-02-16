import { Icon } from "@iconify/react";

const RequestCard = ({ request, status }) => {
    const statusConfig = {
        pending: {
            icon: "mdi:clock-outline",
            color: "text-warning",
            text: "В обработке",
            bgColor: "bg-warning bg-opacity-10",
        },
        approved: {
            icon: "mdi:check-circle-outline",
            color: "text-success",
            text: "Одобрено",
            bgColor: "bg-success bg-opacity-10",
        },
        rejected: {
            icon: "mdi:close-circle-outline",
            color: "text-danger",
            text: "Отклонено",
            bgColor: "bg-danger bg-opacity-10",
        },
    };

    const config = statusConfig[status];

    return (
        <div className={`card p-3 me-3 ${config.bgColor}`}>
            <div className="d-flex justify-content-between align-items-start mb-2 gap-2 align-items-center">
                <h6 className="card-subtitle text-muted">
                    Заявка на зачисление
                </h6>
                <span className={`badge ${config.bgColor} ${config.color}`}>
                    <Icon icon={config.icon} className="me-1" />
                    {config.text}
                </span>
            </div>
            <div className="mb-2">
                <strong>ФИО: </strong>
                {request.name}
            </div>
            <div>
                <strong>Группа: </strong>
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
                            <h5 className="mb-3">
                                {status === "pending" && "Активные заявки"}
                                {status === "approved" && "Одобренные заявки"}
                                {status === "rejected" && "Отклоненные заявки"}
                            </h5>
                            <div className="d-flex flex-wrap gap-3">
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
