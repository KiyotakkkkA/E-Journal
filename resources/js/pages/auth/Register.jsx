import React, { useState } from "react";
import InputWithIcon from "../../components/elements/InputWithIcon";
import axios from "../../axios";
import {
    validateEmail,
    validatePassword,
    validatePasswordConfirmation,
} from "../../scripts/validation";

export default function Register() {
    const [errors, setErrors] = useState({
        email: "",
        password_confirmation: "",
    });
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        password_confirmation: "",
        agree: false,
    });

    const register = () => {
        if (
            !formData.agree ||
            !formData.password ||
            !formData.password_confirmation ||
            !formData.email
        ) {
            return;
        }
        axios.post("/register", formData).then((response) => {});
    };

    const handleChange = (name, value, additionalParams = {}) => {
        setFormData((prev) => ({ ...prev, [name]: value }));

        const validationRules = {
            email: () => validateEmail(value),
            password: () => validatePassword(value),
            password_confirmation: () =>
                validatePasswordConfirmation(additionalParams.password, value),
        };

        if (validationRules[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: validationRules[name](),
            }));
        }

        if (name === "password" && formData.password_confirmation) {
            setErrors((prev) => ({
                ...prev,
                password_confirmation: validatePasswordConfirmation(
                    value,
                    formData.password_confirmation
                ),
            }));
        }
    };

    return (
        <div className="container card mt-5 w-25 px-0">
            <h1 className="text-center bg-purple text-white p-2">
                Регистрация
            </h1>
            <form className="mt-3 px-5">
                <InputWithIcon
                    icon="mdi:email"
                    type="text"
                    id="email"
                    placeholder="Введите электронную почту..."
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    error={errors.email}
                    autoComplete="email"
                />
                <div className="mb-3 position-relative">
                    <InputWithIcon
                        icon="mdi:lock"
                        type="password"
                        id="password"
                        placeholder="Введите пароль..."
                        value={formData.password}
                        onChange={(e) =>
                            handleChange("password", e.target.value)
                        }
                        error={errors.password}
                        autoComplete="password"
                    />
                    {formData.password.length === 0 && (
                        <div className="form-text">
                            Пароль должен содержать минимум 8 символов
                        </div>
                    )}
                </div>
                <div className="mb-3 position-relative">
                    <InputWithIcon
                        icon="mdi:lock"
                        type="password"
                        id="password_confirmation"
                        placeholder="Повторите пароль..."
                        value={formData.password_confirmation}
                        onChange={(e) =>
                            handleChange(
                                "password_confirmation",
                                e.target.value,
                                { password: formData.password }
                            )
                        }
                        error={errors.password_confirmation}
                    />
                </div>
                <div className="mb-3 d-flex gap-2">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="agree"
                        required
                        onChange={(e) =>
                            handleChange("agree", e.target.checked)
                        }
                    />
                    <label
                        htmlFor="agree"
                        className="form-check-label text-muted"
                    >
                        Я согласен с условиями использования
                    </label>
                </div>
                <button
                    type="submit"
                    className="btn btn-purple mb-3 w-100"
                    onClick={register}
                >
                    Зарегистрироваться
                </button>
                <div className="d-flex gap-2 mb-3 justify-content-center">
                    Есть учетная запись?{" "}
                    <a className="text-purple" href="/login">
                        Войти
                    </a>
                </div>
            </form>
        </div>
    );
}
