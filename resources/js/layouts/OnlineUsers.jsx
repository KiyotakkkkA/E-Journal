import React from "react";
import { useOnlineUsers } from "../scripts/hooks/useRealTimeQueries";

export default function OnlineUsers() {
    const { data: onlineUsers = [], isLoading } = useOnlineUsers(30000, false);

    if (isLoading) return <div className="p-4">Загрузка...</div>;
    if (!onlineUsers || onlineUsers.length === 0) return null;

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
                Пользователи онлайн ({onlineUsers.length})
            </h2>
            <div className="space-y-2">
                {onlineUsers.map((user) => (
                    <div key={user.id} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-sm text-gray-600">
                            {user.name}
                        </span>
                        <span className="text-xs text-gray-400">
                            ({user.role_name})
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
