import React from "react";
import { Icon } from "@iconify/react";
import AnimatedLoader from "../../elements/AnimatedLoader";

export default function CafedrasList({
    activeInstitute,
    activeCafedra,
    onCafedraSelect,
    onAddCafedra,
    onEditCafedra,
    onDeleteCafedra,
    cafedras = [],
    isLoading,
}) {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Кафедры
                    </h2>
                    {activeInstitute &&
                        (isLoading ? (
                            <AnimatedLoader className="w-4 h-4" />
                        ) : (
                            <span className="text-xs text-gray-500">
                                Всего: {cafedras.length}
                            </span>
                        ))}
                </div>
                <button
                    onClick={onAddCafedra}
                    disabled={!activeInstitute}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:bg-gray-200 disabled:text-gray-400 transition-all"
                    title={!activeInstitute ? "Сначала выберите институт" : ""}
                >
                    <Icon icon="mdi:plus" className="text-lg" />
                    Добавить кафедру
                </button>
            </div>

            {!activeInstitute ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Icon
                        icon="mdi:school-outline"
                        className="text-4xl text-gray-300 mb-3 mx-auto"
                    />
                    <p className="text-gray-500">
                        Выберите институт для просмотра кафедр
                    </p>
                </div>
            ) : isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <AnimatedLoader className="w-8 h-8" />
                </div>
            ) : cafedras.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Icon
                        icon="mdi:school-outline"
                        className="text-4xl text-gray-300 mb-3 mx-auto"
                    />
                    <p className="text-gray-500">
                        В этом институте пока нет кафедр
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {cafedras.map((cafedra) => (
                        <div
                            key={cafedra.id}
                            onClick={() => onCafedraSelect(cafedra)}
                            className={`relative overflow-hidden p-4 rounded-lg border group transition-all cursor-pointer ${
                                activeCafedra?.id === cafedra.id
                                    ? "bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 shadow-sm"
                                    : "border-gray-200 hover:border-purple-200 hover:bg-purple-50/30"
                            }`}
                        >
                            {activeCafedra?.id === cafedra.id && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-400" />
                            )}
                            <div className="flex justify-between items-start">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Icon
                                            icon="mdi:school-outline"
                                            className={`text-xl ${
                                                activeCafedra?.id === cafedra.id
                                                    ? "text-purple-500"
                                                    : "text-gray-400 group-hover:text-purple-400"
                                            }`}
                                        />
                                        <h3 className="font-medium text-gray-900 truncate">
                                            {cafedra.name}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="flex items-center gap-1 text-gray-500">
                                            <Icon
                                                icon="mdi:account-group-outline"
                                                className="text-lg"
                                            />
                                            <span>
                                                {cafedra.count_teachers || 0}{" "}
                                                преподавателей
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className={`flex gap-1 ${
                                        activeCafedra?.id === cafedra.id
                                            ? "opacity-100"
                                            : "opacity-0 group-hover:opacity-100"
                                    } transition-opacity`}
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEditCafedra(cafedra);
                                        }}
                                        className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-white rounded-md transition-colors"
                                        title="Редактировать"
                                    >
                                        <Icon
                                            icon="mdi:pencil"
                                            className="text-xl"
                                        />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteCafedra(cafedra);
                                        }}
                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-md transition-colors"
                                        title="Удалить"
                                    >
                                        <Icon
                                            icon="mdi:delete"
                                            className="text-xl"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
