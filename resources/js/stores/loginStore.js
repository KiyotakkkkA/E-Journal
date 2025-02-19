import { makeAutoObservable } from "mobx";

class LoginStore {
    loginForm = {
        email: "",
        password: "",
        remember: false,
    };

    loginErrors = {
        email: "",
        password: "",
    };

    constructor() {
        makeAutoObservable(this);
    }

    setLoginForm(key, value) {
        this.loginForm[key] = value;
    }

    getLoginForm() {
        return this.loginForm;
    }

    setErrors(key, value) {
        this.loginErrors[key] = value;
    }

    getErrors() {
        return this.loginErrors;
    }
}

export const loginStore = new LoginStore();
