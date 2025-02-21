import { makeAutoObservable } from "mobx";

class MainPageStore {
    totalData = {
        users: 0,
        groups: 0,
        teachers: 0,
    };

    constructor() {
        makeAutoObservable(this);
    }

    getTotalData() {
        return this.totalData;
    }

    setTotalData(key, value) {
        this.totalData[key] = value;
    }
}

export const mainPageStore = new MainPageStore();
