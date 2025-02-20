import { useState } from "react";
import { Icon } from "@iconify/react";
import { useCreateTeacher } from "../../../scripts/hooks/useTeachersQueries";

const AddTeacherModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({
        email: false,
        password: false,
        password_confirmation: false,
    });

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = ["Email обязателен"];
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
        ) {
            newErrors.email = ["Некорректный email адрес"];
        }

        if (!formData.password) {
            newErrors.password = ["Пароль обязателен"];
        } else if (formData.password.length < 8) {
            newErrors.password = ["Пароль должен содержать минимум 8 символов"];
        }

        if (!formData.password_confirmation) {
            newErrors.password_confirmation = [
                "Подтверждение пароля обязательно",
            ];
        } else if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = ["Пароли не совпадают"];
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        validateForm();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (touched[name]) {
            validateForm();
        }
    };

    const { mutate: createTeacher, isPending } = useCreateTeacher({
        onError: (error) => {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        },
        onSuccess: () => {
            onClose();
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setTouched({
            email: true,
            password: true,
            password_confirmation: true,
        });

        if (validateForm()) {
            createTeacher(formData);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Добавить преподавателя
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <Icon icon="mdi:close" className="text-2xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="example@email.com"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                touched.email && errors.email
                                    ? "border-red-300 focus:ring-red-100 focus:border-red-400"
                                    : "border-gray-300 focus:ring-purple-100 focus:border-purple-400"
                            }`}
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={() => handleBlur("email")}
                        />
                        {touched.email && errors.email && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.email[0]}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Пароль
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Минимум 8 символов"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                touched.password && errors.password
                                    ? "border-red-300 focus:ring-red-100 focus:border-red-400"
                                    : "border-gray-300 focus:ring-purple-100 focus:border-purple-400"
                            }`}
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={() => handleBlur("password")}
                        />
                        {touched.password && errors.password && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.password[0]}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Подтверждение пароля
                        </label>
                        <input
                            type="password"
                            name="password_confirmation"
                            placeholder="Повторите пароль"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                touched.password_confirmation &&
                                errors.password_confirmation
                                    ? "border-red-300 focus:ring-red-100 focus:border-red-400"
                                    : "border-gray-300 focus:ring-purple-100 focus:border-purple-400"
                            }`}
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            onBlur={() => handleBlur("password_confirmation")}
                        />
                        {touched.password_confirmation &&
                            errors.password_confirmation && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.password_confirmation[0]}
                                </p>
                            )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-6 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isPending ? (
                                <div className="flex items-center gap-2">
                                    <Icon
                                        icon="mdi:loading"
                                        className="animate-spin"
                                    />
                                    Создание...
                                </div>
                            ) : (
                                "Создать"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTeacherModal;
