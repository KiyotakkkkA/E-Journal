import React, { useState, useEffect } from "react";
import MenuLayout from "../../../layouts/MenuLayout";
import { Icon } from "@iconify/react";
import AnimatedLoader from "../../../components/elements/AnimatedLoader";
import { Link } from "react-router-dom";
import axios from "../../../axios";

const RequestCard = ({ request, onApprove, onReject }) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 hover:border-purple-200 hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h5 className="text-lg font-semibold text-gray-900 mb-1">
                            Заявка №{request.id}
                        </h5>
                        <div className="text-sm text-gray-500">
                            {new Date(request.created_at).toLocaleDateString()}
                        </div>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        <Icon icon="mdi:clock-outline" className="mr-1.5" />В
                        обработке
                    </span>
                </div>

                <div className="space-y-4 bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                            <Icon
                                icon="mdi:account"
                                className="text-xl text-purple-600"
                            />
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-0.5">
                                Студент
                            </div>
                            <div className="font-medium text-gray-900">
                                {request.name}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Icon
                                icon="mdi:account-group"
                                className="text-xl text-blue-600"
                            />
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-0.5">
                                Группа
                            </div>
                            <div className="font-medium text-gray-900">
                                {request.group.name}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => onApprove(request.id)}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2.5
                        bg-green-600 text-white rounded-lg hover:bg-green-700
                        transition-all duration-200 shadow-sm hover:shadow group"
                    >
                        <Icon
                            icon="mdi:check"
                            className="mr-2 text-xl group-hover:scale-110 transition-transform"
                        />
                        Одобрить
                    </button>
                    <button
                        onClick={() => onReject(request.id)}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2.5
                        border border-red-200 text-red-600 rounded-lg
                        hover:bg-red-50 hover:border-red-300 hover:text-red-700
                        transition-all duration-200 group"
                    >
                        <Icon
                            icon="mdi:close"
                            className="mr-2 text-xl group-hover:scale-110 transition-transform"
                        />
                        Отклонить
                    </button>
                </div>
            </div>
        </div>
    );
};

const Requests = () => {
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

    if (isLoading)
        return (
            <MenuLayout>
                <AnimatedLoader className="mt-4" />
            </MenuLayout>
        );

    return (
        <MenuLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                            Заявки на прикрепление
                            {requests.length > 0 && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-700 border border-red-200">
                                    {requests.length}
                                </span>
                            )}
                        </h1>
                        <p className="text-gray-600">
                            Управление заявками на прикрепление к группам
                        </p>
                    </div>
                    <Link
                        to="/admin"
                        className="p-2 text-gray-500 hover:text-gray-600 bg-gray-100
                        hover:bg-gray-200 rounded-lg transition-all duration-200"
                    >
                        <Icon icon="mdi:arrow-left" className="text-xl" />
                    </Link>
                </div>

                {requests.length === 0 ? (
                    <div className="max-w-md mx-auto text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                            <Icon
                                icon="mdi:information"
                                className="text-3xl text-blue-600"
                            />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Нет активных заявок
                        </h3>
                        <p className="text-gray-500">
                            На данный момент нет заявок, требующих рассмотрения
                        </p>
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
