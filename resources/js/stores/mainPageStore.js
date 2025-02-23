import { makeAutoObservable, action, runInAction } from "mobx";

class MainPageStore {
    totalData = {
        students: 0,
        groups: 0,
        teachers: 0,
        lessons: 0,
    };

    constructor() {
        makeAutoObservable(this, {
            syncData: action,
            setTotalData: action,
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

    getTotalData() {
        return this.totalData;
    }

    setTotalData(key, value) {
        this.totalData[key] = value;
    }
}

export const mainPageStore = new MainPageStore();
