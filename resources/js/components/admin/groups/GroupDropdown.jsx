import React, { useState, useEffect } from "react";
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
import DeleteGroupModal from "../modals/DeleteGroupModal";
import EditGroupModal from "../modals/EditGroupModal";

export default function GroupDropdown({ group, disabled, onOperationStart }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const { mutate: updateGroup, isPending: isUpdating } = useUpdateGroup();
    const { mutate: deleteGroup, isPending: isDeleting } = useDeleteGroup();

    const isLoading = isUpdating || isDeleting;

    useEffect(() => {
        if (isUpdating) {
            onOperationStart("editing");
        } else if (isDeleting) {
            onOperationStart("deleting");
        } else {
            const timer = setTimeout(() => {
                onOperationStart(null);
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [isUpdating, isDeleting]);

    return (
        <>
            <Menu
                as="div"
                className="relative"
                onClick={(e) => e.stopPropagation()}
            >
                <MenuButton
                    className={`
                        text-gray-400 hover:text-gray-600
                        transition-colors duration-200 p-1
                        ${
                            disabled || isLoading
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                        }
                    `}
                    disabled={disabled || isLoading}
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
                                        className={`
                                            ${
                                                active
                                                    ? "bg-gray-50 text-gray-900"
                                                    : "text-gray-700"
                                            }
                                            w-full text-left px-4 py-2 text-sm
                                            ${
                                                isLoading
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                            }
                                            flex items-center
                                        `}
                                        onClick={() => setShowEditModal(true)}
                                        disabled={isLoading}
                                    >
                                        <Icon
                                            icon="mdi:pencil"
                                            className="mr-2 text-gray-400 w-5 h-5"
                                        />
                                        Редактировать
                                    </button>
                                )}
                            </MenuItem>
                            <MenuItem>
                                {({ active }) => (
                                    <button
                                        onClick={() => setShowDeleteModal(true)}
                                        className={`
                                            ${
                                                active
                                                    ? "bg-red-50 text-red-700"
                                                    : "text-red-600"
                                            }
                                            w-full px-4 py-2 text-sm
                                            ${
                                                isLoading
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                            }
                                            flex items-center
                                        `}
                                        disabled={isLoading}
                                    >
                                        <Icon
                                            icon="mdi:delete"
                                            className="mr-2 w-5 h-5"
                                        />
                                        Удалить
                                    </button>
                                )}
                            </MenuItem>
                        </div>
                    </MenuItems>
                </Transition>
            </Menu>

            <DeleteGroupModal
                group={group}
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={deleteGroup}
            />

            <EditGroupModal
                group={group}
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSave={updateGroup}
            />
        </>
    );
}
