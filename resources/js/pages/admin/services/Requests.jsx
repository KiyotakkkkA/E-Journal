import React, { useState, useEffect } from "react";
import MenuLayout from "../../../layouts/MenuLayout";
import { Icon } from "@iconify/react";
import AnimatedLoader from "../../../components/elements/AnimatedLoader";

const RequestCard = ({ request, onApprove, onReject }) => {
    const statusConfig = {
        pending: {
            icon: "mdi:clock-outline",
            color: "text-warning",
            text: "В обработке",
            bgColor: "bg-warning bg-opacity-10",
        },
    };

    return (
        <div className={`card h-100 ${statusConfig.pending.bgColor}`}>
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title mb-0">Заявка №{request.id}</h5>
                    <span
                        className={`badge ${statusConfig.pending.bgColor} ${statusConfig.pending.color}`}
                    >
                        <Icon
                            icon={statusConfig.pending.icon}
                            className="me-1"
                        />
                        {statusConfig.pending.text}
                    </span>
                </div>

                <div className="mb-3">
                    <div className="text-muted mb-1">Студент</div>
                    <div className="fw-medium">{request.name}</div>
                </div>

                <div className="mb-3">
                    <div className="text-muted mb-1">Группа</div>
                    <div className="fw-medium">{request.group.name}</div>
                </div>

                <div className="mb-3">
                    <div className="text-muted mb-1">Дата заявки</div>
                    <div className="fw-medium">
                        {new Date(request.created_at).toLocaleDateString()}
                    </div>
                </div>

                <div className="d-flex gap-2 mt-4">
                    <button
                        className="btn btn-success flex-grow-1"
                        onClick={() => onApprove(request.id)}
                    >
                        <Icon icon="mdi:check" className="me-1" />
                        Одобрить
                    </button>
                    <button
                        className="btn btn-danger flex-grow-1"
                        onClick={() => onReject(request.id)}
                    >
                        <Icon icon="mdi:close" className="me-1" />
                        Отклонить
                    </button>
                </div>
            </div>
        </div>
    );
};

const Requests = ({ canViewAdminPanel }) => {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get("/api/admin/requests/all");
            setRequests(response.data.requests);
        } catch (error) {
            console.error("Error fetching requests:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async (requestId) => {
        try {
            await axios.post(`/api/admin/requests/${requestId}/approve`);
            fetchRequests();
        } catch (error) {
            console.error("Error approving request:", error);
        }
    };

    const handleReject = async (requestId) => {
        try {
            await axios.post(`/api/admin/requests/${requestId}/reject`);
            fetchRequests();
        } catch (error) {
            console.error("Error rejecting request:", error);
        }
    };

    if (isLoading) return <AnimatedLoader />;

    return (
        <MenuLayout canViewAdminPanel={canViewAdminPanel}>
            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0">
                        Заявки на прикрепление
                        {requests.length > 0 && (
                            <span className="badge bg-danger ms-2 rounded-pill">
                                {requests.length}
                            </span>
                        )}
                    </h2>
                </div>

                {requests.length === 0 ? (
                    <div className="alert alert-info">
                        <Icon icon="mdi:information" className="me-2" />
                        Нет активных заявок на рассмотрение
                    </div>
                ) : (
                    <div className="row g-4">
                        {requests.map((request) => (
                            <div key={request.id} className="col-md-6 col-lg-4">
                                <RequestCard
                                    request={request}
                                    onApprove={handleApprove}
                                    onReject={handleReject}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </MenuLayout>
    );
};

export default Requests;
