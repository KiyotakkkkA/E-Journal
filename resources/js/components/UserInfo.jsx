import React, { useState, useEffect } from "react";
import axios from "../axios";
import AnimatedLoader from "./elements/AnimatedLoader";
import { getGroups } from "../scripts/graphql";
import UserCard from "./user/UserCard";
import StudentRequestForm from "./student/StudentRequestForm";
import StudentRequests from "./student/StudentRequests";

const UserInfo = ({ isStudent }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRequestNeeded, setIsRequestNeeded] = useState(false);
    const [groups, setGroups] = useState([]);
    const [requestData, setRequestData] = useState({
        name: "",
        group_id: "",
    });
    const [requests, setRequests] = useState({
        pending: [],
        approved: [],
        rejected: [],
    });

    const fetchUserData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get("/api/user");
            setUserInfo(response.data.user);
            const requests = await axios.get("api/user/student");
            setRequests(requests.data.requests);
            if (isStudent && !response.data.user.group.name) {
                const groups = await getGroups();
                setGroups(groups.data.groups);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const sendRequest = async () => {
        try {
            const response = await axios.post("/user/student", {
                name: requestData.name,
                group_id: requestData.group_id,
            });

            if (response.data.status) {
                setIsRequestNeeded(false);
                await fetchUserData();
            }
        } catch (error) {
            console.error("Error sending request:", error);
        }
    };

    const logout = () => {
        axios.post("/logout").then((response) => {
            window.location.reload();
        });
    };

    if (isLoading) {
        return <AnimatedLoader />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container">
            <UserCard userInfo={userInfo} isStudent={isStudent} />

            {!isRequestNeeded &&
                isStudent &&
                !userInfo.group.name &&
                requests.pending.length === 0 &&
                requests.approved.length === 0 && (
                    <div className="d-flex mt-4">
                        <button
                            className="btn btn-purple"
                            onClick={() => setIsRequestNeeded(true)}
                        >
                            Отправить заявку на прикрепление к группе
                        </button>
                    </div>
                )}

            {isRequestNeeded && (
                <StudentRequestForm
                    requestData={requestData}
                    setRequestData={setRequestData}
                    groups={groups}
                    onSubmit={sendRequest}
                />
            )}

            <StudentRequests requests={requests} />

            <button className="btn btn-danger mt-2" onClick={logout}>
                Выйти
            </button>
        </div>
    );
};

export default UserInfo;
