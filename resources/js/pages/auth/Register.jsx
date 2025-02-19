import React, { useState } from "react";
import InputWithIcon from "../../components/elements/InputWithIcon";
import { useRegister } from "../../scripts/hooks/useAuthQueries";
import {
    validateEmail,
    validatePassword,
    validatePasswordConfirmation,
} from "../../scripts/validation";
import { registerStore } from "../../stores/registerStore";
import { observer } from "mobx-react-lite";

const Register = observer(() => {
    const registerForm = registerStore.getRegisterForm();
    const registerErrors = registerStore.getErrors();

    const {
        mutate: register,
        isPending: isRegisterLoading,
        isSuccess: isRegisterSuccess,
        error: registerError,
    } = useRegister();

    const handleChange = (name, value, additionalParams = {}) => {
        registerStore.setRegisterForm(name, value);

        const validationRules = {
            email: () => validateEmail(value),
            password: () => validatePassword(value),
            password_confirmation: () =>
                validatePasswordConfirmation(additionalParams.password, value),
        };

        if (validationRules[name]) {
            registerStore.setErrors(name, validationRules[name]());
        }

        if (name === "password" && registerForm.password_confirmation) {
            registerStore.setErrors(
                "password_confirmation",
                validatePasswordConfirmation(
                    value,
                    registerForm.password_confirmation
                )
            );
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 bg-white rounded-lg shadow-lg overflow-hidden">
            <h1 className="text-center bg-purple-600 text-white py-3 text-2xl font-semibold uppercase">
                Регистрация
            </h1>
            {registerError && (
                <div className="mx-4 mt-4 p-3 bg-red-100 text-red-700 rounded-md text-center">
                    {registerError.general}
                </div>
            )}
            <form
                className="p-6 space-y-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    register(registerForm);
                }}
            >
                <InputWithIcon
                    icon="mdi:email"
                    type="text"
                    id="email"
                    placeholder="Введите электронную почту..."
                    value={registerForm.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    error={registerErrors.email}
                    autoComplete="email"
                />
                <div className="space-y-1">
                    <InputWithIcon
                        icon="mdi:lock"
                        type="password"
                        id="password"
                        placeholder="Введите пароль..."
                        value={registerForm.password}
                        onChange={(e) =>
                            handleChange("password", e.target.value)
                        }
                        error={registerErrors.password}
                        autoComplete="password"
                    />
                    {registerForm.password.length === 0 && (
                        <span className="text-xs text-gray-500 pl-2">
                            Пароль должен содержать минимум 8 символов
                        </span>
                    )}
                </div>
                <InputWithIcon
                    icon="mdi:lock-check"
                    type="password"
                    id="password_confirmation"
                    placeholder="Повторите пароль..."
                    value={registerForm.password_confirmation}
                    onChange={(e) =>
                        handleChange("password_confirmation", e.target.value, {
                            password: registerForm.password,
                        })
                    }
                    error={registerErrors.password_confirmation}
                />
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="agree"
                        required
                        onChange={(e) =>
                            handleChange("agree", e.target.checked)
                        }
                        className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="agree" className="text-gray-600 text-sm">
                        Я согласен с условиями использования
                    </label>
                </div>
                <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg
                             transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                             font-medium"
                    disabled={isRegisterLoading || isRegisterSuccess}
                >
                    {isRegisterLoading || isRegisterSuccess
                        ? "Загрузка..."
                        : "Зарегистрироваться"}
                </button>
                <div className="text-center text-sm mt-2">
                    <span className="text-gray-600">Есть учетная запись?</span>{" "}
                    <a
                        href="/login"
                        className="text-purple-600 hover:text-purple-500 font-medium"
                    >
                        Войти
                    </a>
                </div>
            </form>
        </div>
    );
});

export default Register;
