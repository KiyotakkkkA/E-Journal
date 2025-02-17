import React, { useState } from "react";
import AnimatedLoader from "./elements/AnimatedLoader";
import UserCard from "./user/UserCard";
import StudentRequestForm from "./student/StudentRequestForm";
import StudentRequests from "./student/StudentRequests";
import {
    useUserInfo,
    useUserRequests,
    useSendRequest,
} from "../scripts/hooks/useUserQueries";
import { useGroups } from "../scripts/hooks/useGroupsQueries";
import { useLogout } from "../scripts/hooks/useAuthQueries";

const UserInfo = ({ isStudent }) => {
    const [isRequestNeeded, setIsRequestNeeded] = useState(false);
    const [requestData, setRequestData] = useState({
        name: "",
        group_id: "",
    });

    const {
        mutate: logout,
        isPending: isLogoutLoading,
        isSuccess: isLogoutSuccess,
    } = useLogout();

    const {
        data: userData,
        isLoading: isUserLoading,
        error: userError,
    } = useUserInfo();

    const {
        data: requests = { pending: [], approved: [], rejected: [] },
        isLoading: isRequestsLoading,
    } = useUserRequests();

    const { data: groups = [], isLoading: isGroupsLoading } = useGroups();

    const {
        mutate: sendRequest,
        isPending: isRequestLoading,
        isSuccess: isRequestSuccess,
    } = useSendRequest();

    const handleSubmit = () => {
        sendRequest(requestData, {
            onSuccess: () => {
                setIsRequestNeeded(false);
                setRequestData({ name: "", group_id: "" });
            },
        });
    };

    if (isUserLoading || isRequestsLoading || isGroupsLoading) {
        return <AnimatedLoader className="mt-3" />;
    }

    if (userError) {
        return <div>Error: {userError.message}</div>;
    }

    return (
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <UserCard userInfo={userData?.user} isStudent={isStudent} />

            {!isRequestNeeded &&
                isStudent &&
                !userData?.user?.currentGroup &&
                requests.pending.length === 0 &&
                requests.approved.length === 0 &&
                !isRequestLoading &&
                !isRequestSuccess && (
                    <div className="d-flex mt-4 ">
                        <button
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all duration-200"
                            onClick={() => setIsRequestNeeded(true)}
                        >
                            Прикрепиться к группе
                        </button>
                    </div>
                )}

            {isRequestNeeded && (
                <StudentRequestForm
                    requestData={requestData}
                    setRequestData={setRequestData}
                    groups={groups}
                    onSubmit={handleSubmit}
                />
            )}

            <StudentRequests requests={requests} />

            <button
                className="btn btn-danger"
                onClick={() => logout()}
                disabled={isLogoutLoading || isLogoutSuccess}
            >
                Выйти
            </button>
        </div>
    );
};

export default UserInfo;
