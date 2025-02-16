import isEmail from "validator/lib/isEmail";

const validateEmail = (email) => {
    if (email.length === 0) {
        return "Email обязателен";
    } else if (!isEmail(email)) {
        return "Некорректный формат email";
    }
    return "";
};

const validatePassword = (password) => {
    if (password.length < 8) {
        return "Пароль должен содержать минимум 8 символов";
    }
    return "";
};

const validatePasswordConfirmation = (password, passwordConfirmation) => {
    if (password !== passwordConfirmation) {
        return "Пароли не совпадают";
    }
    return "";
};

export { validateEmail, validatePassword, validatePasswordConfirmation };
