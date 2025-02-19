import { makeAutoObservable } from "mobx";

class RegisterStore {
    registerForm = {
        email: "",
        password: "",
        password_confirmation: "",
        agree: false,
    };

    registerErrors = {
        email: "",
        password_confirmation: "",
    };

    constructor() {
        makeAutoObservable(this);
    }

    setRegisterForm(key, value) {
        this.registerForm[key] = value;
    }

    getRegisterForm() {
        return this.registerForm;
    }

    setErrors(key, value) {
        this.registerErrors[key] = value;
    }

    getErrors() {
        return this.registerErrors;
    }
}

export const registerStore = new RegisterStore();
