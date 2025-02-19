import React, { useEffect, useCallback } from "react";
import AnimatedLoader from "./elements/AnimatedLoader";
import UserCard from "./user/UserCard";
import StudentRequestForm from "./student/StudentRequestForm";
import StudentRequests from "./student/StudentRequests";
import GroupHistoryList from "./student/GroupHistoryList";
import {
    useUserInfo,
    useUserRequests,
    useSendRequest,
} from "../scripts/hooks/useUserQueries";
import { useGroups } from "../scripts/hooks/useGroupsQueries";
import { useLogout } from "../scripts/hooks/useAuthQueries";
import { useAuth } from "../contexts/AuthContext";
import { useGroupHistory } from "../scripts/hooks/useGroupsQueries";
import { userProfileStore } from "../stores/userProfileStore";
import { observer } from "mobx-react-lite";

const UserInfo = observer(() => {
    const auth = useAuth();
    const roles = userProfileStore.getRoles();
    const isRequestNeeded = userProfileStore.getIsRequestNeeded();
    const requestData = userProfileStore.getRequestData();
    const requests = userProfileStore.getRequests();
    const groups = userProfileStore.getGroups();
    const user = userProfileStore.getUser();
    const history = userProfileStore.getHistory();
    const {
        mutate: logout,
        isPending: isLogoutLoading,
        isSuccess: isLogoutSuccess,
    } = useLogout();

    const { data: historyData, isLoading: isHistoryLoading } =
        useGroupHistory();

    const {
        data: userData,
        isLoading: isUserLoading,
        error: userError,
    } = useUserInfo();

    const {
        data: requestsData = {
            pending: [],
            approved: [],
            rejected: [],
            group_deleted: [],
        },
        isLoading: isRequestsLoading,
    } = useUserRequests();

    const { data: groupsData = [], isLoading: isGroupsLoading } = useGroups();
    const {
        mutate: sendRequest,
        isPending: isRequestLoading,
        isSuccess: isRequestSuccess,
    } = useSendRequest();

    const syncData = useCallback((data, type, isLoading) => {
        if (data && !isLoading && data !== userProfileStore[type]) {
            userProfileStore.syncData(data, type);
        }
    }, []);

    useEffect(() => {
        if (auth.roles) {
            syncData(auth.roles, "roles", false);
        }
    }, [auth.roles, syncData]);

    useEffect(() => {
        syncData(userData, "user", isUserLoading);
    }, [userData, isUserLoading, syncData]);

    useEffect(() => {
        syncData(groupsData, "groups", isGroupsLoading);
    }, [groupsData, isGroupsLoading, syncData]);

    useEffect(() => {
        syncData(requestsData, "requests", isRequestsLoading);
    }, [requestsData, isRequestsLoading, syncData]);

    useEffect(() => {
        syncData(historyData, "history", isHistoryLoading);
    }, [historyData, isHistoryLoading, syncData]);

    const handleSubmit = useCallback(() => {
        const updatedRequestData = {
            ...requestData,
            name: user?.user?.name || requestData.name,
        };

        userProfileStore.setRequestData(updatedRequestData);

        sendRequest(updatedRequestData, {
            onSuccess: () => {
                userProfileStore.setIsRequestNeeded(false);
                userProfileStore.setRequestData({ name: "", group_id: "" });
            },
        });
    }, [requestData, user?.user?.name, sendRequest]);

    const canWeJoinToGroup = () => {
        // Если пользователь админ, то он не может присоединиться к группе
        if (roles.isAdmin) {
            return false;
        }
        // Активная форма заявки
        if (isRequestNeeded) {
            return false;
        }
        // Если пользователь только подтвердил почту
        if (roles.isEmailVerified) {
            // Если у него есть заявка на прикрепление к группе, то он не может присоединиться к группе
            if (requests?.pending?.length > 0) {
                return false;
            }
            return true;
        }
        // Если пользователь студент
        if (roles.isStudent) {
            // Если пользователь не в группе
            if (auth.isInGroup) {
                return false;
            }
            // Если у него есть заявка на прикрепление к группе, то он не может присоединиться к группе
            if (!auth.isInGroup) {
                return !(requests?.pending?.length > 0);
            }
            return true;
        }
        // Если мы загружаем заявку
        return !isRequestLoading && !isRequestSuccess;
    };

    if (
        isUserLoading ||
        isRequestsLoading ||
        isGroupsLoading ||
        isHistoryLoading
    ) {
        return <AnimatedLoader className="mt-3" />;
    }

    if (userError) {
        return <div>Error: {userError.message}</div>;
    }

    return (
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <UserCard userInfo={user?.user} isStudent={roles.isStudent} />

            {canWeJoinToGroup() && (
                <div className="mt-4">
                    <button
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all duration-200"
                        onClick={() =>
                            userProfileStore.setIsRequestNeeded(true)
                        }
                    >
                        Прикрепиться к группе
                    </button>
                </div>
            )}

            {isRequestNeeded && (
                <StudentRequestForm
                    requestData={requestData}
                    setRequestData={userProfileStore.setRequestData}
                    groups={groups}
                    onSubmit={handleSubmit}
                />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                    <StudentRequests requests={requests} />
                </div>
                <div>
                    <GroupHistoryList history={history} />
                </div>
            </div>

            <button
                className="btn btn-danger mt-4"
                onClick={() => logout()}
                disabled={isLogoutLoading || isLogoutSuccess}
            >
                Выйти
            </button>
        </div>
    );
});

export default UserInfo;
