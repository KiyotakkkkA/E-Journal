import React from "react";
import { useGroups } from "../../scripts/hooks/useGroupsQueries";
import { Icon } from "@iconify/react";
import AnimatedLoader from "../elements/AnimatedLoader";

export default function GroupSelector({ selectedGroup, onGroupSelect }) {
    const { data: groups, isLoading } = useGroups();

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 text-gray-500">
                <AnimatedLoader className="w-5 h-5" />
                Загрузка групп...
            </div>
        );
    }

    return (
        <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Группа
            </label>
            <div className="relative">
                <select
                    value={selectedGroup?.id || ""}
                    onChange={(e) => {
                        const group = groups.find(
                            (g) => String(g.id) === e.target.value
                        );
                        onGroupSelect(group);
                    }}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                    <option value="">Выберите группу</option>
                    {groups?.map((group) => (
                        <option key={group.id} value={String(group.id)}>
                            {group.name}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <Icon
                        icon="mdi:chevron-down"
                        className="text-xl text-gray-400"
                    />
                </div>
            </div>
        </div>
    );
}
