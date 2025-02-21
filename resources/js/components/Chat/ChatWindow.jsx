import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import {
    useMessages,
    useOnlineUsers,
    useSendMessage,
} from "../../scripts/hooks/useRealTimeQueries";

export default function ChatWindow() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const messagesEndRef = useRef(null);
    const chatRef = useRef(null);

    const { data: messagesData } = useMessages();

    const { data: onlineUsers } = useOnlineUsers(5000, true);

    const { mutate: sendMessage } = useSendMessage(setMessage, "");

    const messages = messagesData?.messages || [];

    const filteredUsers = onlineUsers?.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (chatRef.current && !chatRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey && message.trim()) {
            e.preventDefault();
            sendMessage({
                to_user_id: selectedUser.id,
                content: message,
            });
        }
    };

    return (
        <div ref={chatRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-gray-50 rounded-lg p-4 flex items-center justify-between hover:bg-gray-100 transition-colors border border-gray-200"
            >
                <div className="flex items-center gap-3">
                    <Icon
                        icon="mdi:chat"
                        className="text-2xl text-purple-600"
                    />
                    <span className="font-medium text-gray-900">
                        Чат пользователей онлайн
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                        {onlineUsers?.length || 0} онлайн
                    </span>
                    <Icon
                        icon={isOpen ? "mdi:chevron-up" : "mdi:chevron-down"}
                        className="text-xl text-gray-400"
                    />
                </div>
            </button>

            {isOpen && (
                <div
                    className="absolute top-full left-0 right-0 mt-2
                        bg-white rounded-lg shadow-xl border border-gray-200
                        overflow-hidden z-50"
                    style={{
                        height: "600px",
                    }}
                >
                    <div className="h-full flex flex-col">
                        <div className="flex-1 flex min-h-0">
                            <div className="w-80 bg-gray-50 flex flex-col">
                                <div className="p-4 bg-white border-b border-gray-200">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) =>
                                                setSearchQuery(e.target.value)
                                            }
                                            placeholder="Поиск пользователей..."
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm
                                                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                        <Icon
                                            icon="mdi:magnify"
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
                                        />
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto custom-scrollbar">
                                    <div className="p-3">
                                        {filteredUsers?.map((user) => (
                                            <button
                                                key={user.id}
                                                onClick={() =>
                                                    setSelectedUser(user)
                                                }
                                                className={`w-full text-left p-3 rounded-xl transition-all mb-2
                                                    ${
                                                        selectedUser?.id ===
                                                        user.id
                                                            ? "bg-purple-50 border-purple-100 shadow-sm"
                                                            : "hover:bg-gray-100"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-12 h-12 rounded-full flex items-center justify-center
                                                        ${
                                                            selectedUser?.id ===
                                                            user.id
                                                                ? "bg-purple-100"
                                                                : "bg-gray-100"
                                                        }`}
                                                    >
                                                        <Icon
                                                            icon="mdi:account"
                                                            className={`text-2xl ${
                                                                selectedUser?.id ===
                                                                user.id
                                                                    ? "text-purple-600"
                                                                    : "text-gray-500"
                                                            }`}
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-medium text-gray-900">
                                                            {user.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {user.role_name}
                                                        </div>
                                                    </div>
                                                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col min-w-0 border-l border-gray-200">
                                {selectedUser ? (
                                    <>
                                        <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                                <Icon
                                                    icon="mdi:account"
                                                    className="text-2xl text-purple-600"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900">
                                                    {selectedUser.name}
                                                </h3>
                                                <span className="text-sm text-gray-500">
                                                    {selectedUser.role_name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-green-600">
                                                    Онлайн
                                                </span>
                                                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                            </div>
                                        </div>

                                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-gray-50">
                                            {messages
                                                .filter(
                                                    (msg) =>
                                                        msg.from_user_id ===
                                                            selectedUser.id ||
                                                        msg.to_user_id ===
                                                            selectedUser.id
                                                )
                                                .map((msg) => (
                                                    <div
                                                        key={msg.id}
                                                        className={`flex ${
                                                            msg.from_user_id ===
                                                            selectedUser.id
                                                                ? "justify-start"
                                                                : "justify-end"
                                                        }`}
                                                    >
                                                        <div
                                                            className={`max-w-[70%] rounded-2xl p-4 shadow-sm break-words ${
                                                                msg.from_user_id ===
                                                                selectedUser.id
                                                                    ? "bg-white"
                                                                    : "bg-purple-500 text-white"
                                                            }`}
                                                        >
                                                            <p className="text-sm whitespace-pre-wrap break-words">
                                                                {msg.content}
                                                            </p>
                                                            <span
                                                                className={`text-xs mt-2 block ${
                                                                    msg.from_user_id ===
                                                                    selectedUser.id
                                                                        ? "text-gray-400"
                                                                        : "text-purple-200"
                                                                }`}
                                                            >
                                                                {new Date(
                                                                    msg.created_at
                                                                ).toLocaleTimeString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            <div ref={messagesEndRef} />
                                        </div>

                                        <div className="p-4 bg-white border-t border-gray-200">
                                            <div className="flex gap-3 items-end bg-gray-50 p-2 rounded-xl">
                                                <div className="flex-1">
                                                    <textarea
                                                        value={message}
                                                        onChange={(e) =>
                                                            setMessage(
                                                                e.target.value
                                                            )
                                                        }
                                                        onKeyPress={
                                                            handleKeyPress
                                                        }
                                                        placeholder="Введите сообщение..."
                                                        className="w-full px-4 py-3 bg-transparent border-0
                                                            resize-none h-[42px] overflow-y-auto custom-scrollbar
                                                            focus:outline-none placeholder-gray-400 focus:ring-0
                                                            break-words whitespace-pre-wrap"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        sendMessage({
                                                            to_user_id:
                                                                selectedUser.id,
                                                            content: message,
                                                        })
                                                    }
                                                    disabled={!message.trim()}
                                                    className="p-3 bg-purple-600 text-white rounded-xl
                                                        disabled:opacity-50 hover:bg-purple-700 transition-all
                                                        h-[42px] w-[42px] flex items-center justify-center
                                                        flex-shrink-0 shadow-sm"
                                                >
                                                    <Icon
                                                        icon="mdi:send"
                                                        className="text-xl -rotate-45"
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-full flex items-center justify-center bg-gray-50">
                                        <div className="text-center p-8 rounded-2xl bg-white shadow-sm border border-gray-100">
                                            <Icon
                                                icon="mdi:chat-outline"
                                                className="text-6xl text-purple-200 mb-4 mx-auto"
                                            />
                                            <h3 className="text-xl font-medium text-gray-900 mb-2">
                                                Начните общение
                                            </h3>
                                            <p className="text-gray-500">
                                                Выберите пользователя из списка
                                                слева
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
