import { makeAutoObservable, action, runInAction, computed } from "mobx";

class UserProfileStore {
    roles = {};
    isRequestNeeded = false;
    requestData = {
        name: "",
        group_id: "",
    };
    requests = {
        pending: [],
        approved: [],
        rejected: [],
        deleted: [],
    };
    groups = [];
    user = {};
    history = [];

    constructor() {
        makeAutoObservable(this, {
            syncData: action,
            setRoles: action,
            setIsRequestNeeded: action,
            setRequestData: action,
            setRequests: action,
            setGroups: action,
            setUser: action,
            setHistory: action,
            hasActiveRequests: computed,
        });
    }

    syncData = (data, type) => {
        if (!data || JSON.stringify(this[type]) === JSON.stringify(data)) {
            return;
        }

        runInAction(() => {
            this[type] = data;
        });
    };

    setRoles = (roles) => {
        this.roles = roles;
    };

    getRoles() {
        return this.roles;
    }

    setIsRequestNeeded = (isRequestNeeded) => {
        this.isRequestNeeded = isRequestNeeded;
    };

    getIsRequestNeeded() {
        return this.isRequestNeeded;
    }

    setRequestData = (requestData) => {
        this.requestData = requestData;
    };

    getRequestData() {
        return this.requestData;
    }

    setRequests = (requests) => {
        this.requests = requests;
    };

    getRequests() {
        return this.requests;
    }

    setGroups = (groups) => {
        this.groups = groups;
    };

    getGroups() {
        return this.groups;
    }

    setUser = (user) => {
        this.user = user;
    };

    getUser() {
        return this.user;
    }

    setHistory = (history) => {
        this.history = history;
    };

    getHistory() {
        return this.history;
    }

    get hasActiveRequests() {
        return (
            this.requests.pending.length > 0 ||
            this.requests.approved.length > 0
        );
    }
}

export const userProfileStore = new UserProfileStore();
