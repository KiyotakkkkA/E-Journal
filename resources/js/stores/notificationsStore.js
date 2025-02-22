import { makeAutoObservable, action, runInAction } from "mobx";

class NotificationsStore {
    notifications = {
        requestsCount: 0,
        messagesCount: 0,
    };

    constructor() {
        makeAutoObservable(this, {
            syncData: action,
            setRequestsCount: action,
            setMessagesCount: action,
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

    setRequestsCount(count) {
        this.notifications.requestsCount = count;
    }

    getRequestsCount() {
        return this.notifications.requestsCount;
    }

    getMessagesCount() {
        return this.notifications.messagesCount;
    }

    setMessagesCount(count) {
        this.notifications.messagesCount = count;
    }

    getSummNotifications() {
        return (
            this.notifications.requestsCount + this.notifications.messagesCount
        );
    }
}

export const notificationsStore = new NotificationsStore();
