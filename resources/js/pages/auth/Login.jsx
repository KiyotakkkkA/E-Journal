import React, { useState } from "react";
import InputWithIcon from "../../components/elements/InputWithIcon";
import axios from "../../axios";
import { validateEmail } from "../../scripts/validation";

export default function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: false,
    });
    const [errors, setErrors] = useState({
        email: "",
    });

    const login = () => {
        if (!formData.email || !formData.password) {
            return;
        }
        axios.post("/login", formData).then((response) => {});
    };

    const handleChange = (name, value, additionalParams = {}) => {
        setFormData((prev) => ({ ...prev, [name]: value }));

        const validationRules = {
            email: () => validateEmail(value),
        };

        if (validationRules[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: validationRules[name](),
            }));
        }
    };

    return (
        <div className="container card mt-5 w-25 px-0">
            <h1 className="text-center bg-purple text-white p-2">Вход</h1>
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

                <InputWithIcon
                    icon="mdi:lock"
                    type="password"
                    id="password"
                    placeholder="Введите пароль..."
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    autoComplete="password"
                    appendContent={
                        <a className="text-purple" href="/forgot-password">
                            Забыли пароль?
                        </a>
                    }
                />

                <div className="mb-3 d-flex gap-2">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="remember"
                        checked={formData.remember}
                        onChange={(e) =>
                            handleChange("remember", e.target.checked)
                        }
                    />
                    <label
                        htmlFor="remember"
                        className="form-check-label text-muted"
                    >
                        Запомнить меня
                    </label>
                </div>
                <button
                    type="submit"
                    className="btn btn-purple mb-3 w-100"
                    onClick={login}
                >
                    Войти
                </button>
                <div className="d-flex gap-2 mb-3 justify-content-center">
                    Нет учетной записи?{" "}
                    <a className="text-purple" href="/register">
                        Зарегистрироваться
                    </a>
                </div>
            </form>
        </div>
    );
}
