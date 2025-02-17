import React, { useState, useRef } from "react";
import InputWithIcon from "../../components/elements/InputWithIcon";
import { validateEmail } from "../../scripts/validation";
import { useLogin } from "../../scripts/hooks/useAuthQueries";

export default function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: false,
    });
    const [serverErrors, setServerErrors] = useState({});

    const {
        mutate: login,
        isPending: isLoginLoading,
        isSuccess: isLoginSuccess,
        error: loginError,
    } = useLogin();

    const handleChange = (name, value, additionalParams = {}) => {
        setFormData((prev) => ({ ...prev, [name]: value }));

        const validationRules = {
            email: () => validateEmail(value),
        };

        if (validationRules[name]) {
            setServerErrors((prev) => ({
                ...prev,
                [name]: validationRules[name](),
            }));
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 bg-white rounded-lg shadow-lg overflow-hidden">
            <h1 className="text-center bg-purple-600 text-white py-3 text-2xl font-semibold uppercase">
                Вход
            </h1>
            {loginError && (
                <div className="mx-4 mt-4 p-3 bg-red-100 text-red-700 rounded-md text-center">
                    {loginError.message}
                </div>
            )}
            <form
                className="p-6 space-y-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    login(formData);
                }}
            >
                <InputWithIcon
                    icon="mdi:email"
                    type="email"
                    id="email"
                    placeholder="Введите электронную почту..."
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    error={serverErrors.email}
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
                        <a
                            className="text-purple-600 hover:text-purple-500 text-sm"
                            href="/forgot-password"
                        >
                            Забыли пароль?
                        </a>
                    }
                />

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="remember"
                        checked={formData.remember}
                        onChange={(e) =>
                            handleChange("remember", e.target.checked)
                        }
                        className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label
                        htmlFor="remember"
                        className="text-gray-600 text-sm h-5"
                    >
                        Запомнить меня
                    </label>
                </div>

                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoginLoading || isLoginSuccess}
                >
                    {isLoginLoading || isLoginSuccess ? "Вход..." : "Войти"}
                </button>

                <div className="text-center text-sm">
                    <span className="text-gray-600">Нет учетной записи?</span>{" "}
                    <a
                        className="text-purple-600 hover:text-purple-500 font-medium"
                        href="/register"
                    >
                        Зарегистрироваться
                    </a>
                </div>
            </form>
        </div>
    );
}
