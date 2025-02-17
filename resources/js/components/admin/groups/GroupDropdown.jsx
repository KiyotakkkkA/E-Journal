import React from "react";
import {
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
    Transition,
} from "@headlessui/react";
import { Fragment } from "react";
import { Icon } from "@iconify/react";
import {
    useUpdateGroup,
    useDeleteGroup,
} from "@/scripts/hooks/useGroupsQueries";
export default function GroupDropdown({ group }) {
    const { mutate: deleteGroup } = useDeleteGroup();

    return (
        <Menu
            as="div"
            className="relative"
            onClick={(e) => e.stopPropagation()}
        >
            <MenuButton
                className="text-gray-400 hover:text-gray-600
                                 transition-colors duration-200 p-1"
            >
                <Icon icon="mdi:dots-vertical" className="text-xl" />
            </MenuButton>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <MenuItems
                    className="absolute right-0 mt-2 w-48 origin-top-right
                                   bg-white rounded-lg shadow-lg border border-gray-100
                                   focus:outline-none z-10"
                >
                    <div className="py-1">
                        <MenuItem>
                            {({ active }) => (
                                <button
                                    className={`${
                                        active
                                            ? "bg-gray-50 text-gray-900"
                                            : "text-gray-700"
                                    } flex w-full items-center px-4 py-2 text-sm`}
                                >
                                    <Icon
                                        icon="mdi:pencil"
                                        className="mr-2 text-gray-400"
                                    />
                                    Редактировать
                                </button>
                            )}
                        </MenuItem>
                        <MenuItem>
                            {({ active }) => (
                                <button
                                    onClick={() => deleteGroup(group.id)}
                                    className={`${
                                        active
                                            ? "bg-red-50 text-red-700"
                                            : "text-red-600"
                                    } flex w-full items-center px-4 py-2 text-sm`}
                                >
                                    <Icon icon="mdi:delete" className="mr-2" />
                                    Удалить
                                </button>
                            )}
                        </MenuItem>
                    </div>
                </MenuItems>
            </Transition>
        </Menu>
    );
}
