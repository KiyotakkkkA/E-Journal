import React, { useState, useEffect } from "react";
import MenuLayout from "../../../layouts/MenuLayout";
import { Icon } from "@iconify/react";
import AnimatedLoader from "../../../components/elements/AnimatedLoader";
import { Link } from "react-router-dom";

const RequestCard = ({ request, onApprove, onReject }) => {
    return (
        <div className="bg-amber-50 rounded-xl border border-amber-100 overflow-hidden">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h5 className="text-lg font-medium text-gray-900">
                        Заявка №{request.id}
                    </h5>
                    <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full
                                   text-xs font-medium bg-amber-100 text-amber-700"
                    >
                        <Icon icon="mdi:clock-outline" className="mr-1" />В
                        обработке
                    </span>
                </div>

                <div className="space-y-4">
                    <div>
                        <div className="text-sm text-gray-500 mb-1">
                            Студент
                        </div>
                        <div className="font-medium text-gray-900">
                            {request.name}
                        </div>
                    </div>

                    <div>
                        <div className="text-sm text-gray-500 mb-1">Группа</div>
                        <div className="font-medium text-gray-900">
                            {request.group.name}
                        </div>
                    </div>

                    <div>
                        <div className="text-sm text-gray-500 mb-1">
                            Дата заявки
                        </div>
                        <div className="font-medium text-gray-900">
                            {new Date(request.created_at).toLocaleDateString()}
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 mt-6">
                    <button
                        onClick={() => onApprove(request.id)}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2
                                 bg-green-600 text-white rounded-lg hover:bg-green-700
                                 transition-colors duration-200"
                    >
                        <Icon icon="mdi:check" className="mr-2" />
                        Одобрить
                    </button>
                    <button
                        onClick={() => onReject(request.id)}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2
                                 bg-red-600 text-white rounded-lg hover:bg-red-700
                                 transition-colors duration-200"
                    >
                        <Icon icon="mdi:close" className="mr-2" />
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
            await axios.post(`/admin/requests/${requestId}/approve`);
            fetchRequests();
        } catch (error) {
            console.error("Error approving request:", error);
        }
    };

    const handleReject = async (requestId) => {
        try {
            await axios.post(`/admin/requests/${requestId}/reject`);
            fetchRequests();
        } catch (error) {
            console.error("Error rejecting request:", error);
        }
    };

    if (isLoading) return <AnimatedLoader className="mt-4" />;

    return (
        <MenuLayout canViewAdminPanel={canViewAdminPanel}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                            Заявки на прикрепление
                            {requests.length > 0 && (
                                <span
                                    className="ml-2 inline-flex items-center px-2.5 py-0.5
                                               rounded-full text-xs font-medium
                                               bg-red-100 text-red-600"
                                >
                                    {requests.length}
                                </span>
                            )}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Управление заявками на прикрепление к группам
                        </p>
                    </div>
                    <Link
                        to="/admin"
                        className="text-gray-500 hover:text-gray-600
                                 transition-all duration-200 transform
                                 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center
                                      bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                        >
                            <Icon icon="mdi:arrow-left" className="text-xl" />
                        </div>
                    </Link>
                </div>

                {requests.length === 0 ? (
                    <div
                        className="bg-blue-50 text-blue-700 px-4 py-3 rounded-lg
                                  flex items-center"
                    >
                        <Icon icon="mdi:information" className="mr-2 text-xl" />
                        Нет активных заявок на рассмотрение
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {requests.map((request) => (
                            <RequestCard
                                key={request.id}
                                request={request}
                                onApprove={handleApprove}
                                onReject={handleReject}
                            />
                        ))}
                    </div>
                )}
            </div>
        </MenuLayout>
    );
};

export default Requests;
