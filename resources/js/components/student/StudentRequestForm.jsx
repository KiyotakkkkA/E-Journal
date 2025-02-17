const StudentRequestForm = ({
    requestData,
    setRequestData,
    groups,
    onSubmit,
}) => {
    return (
        <div className="w-full md:w-1/2 mt-4">
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6">
                    <h5 className="text-xl font-semibold text-gray-800 mb-4">
                        Заявка на прикрепление к группе
                    </h5>
                    <div className="space-y-4">
                        <div>
                            <div className="text-sm text-gray-600 mb-2">
                                Введите ФИО студента
                            </div>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg
                                         focus:ring-1 focus:ring-purple-600 focus:border-purple-600
                                         transition-colors duration-200"
                                value={requestData.name}
                                onChange={(e) =>
                                    setRequestData({
                                        ...requestData,
                                        name: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <div className="text-sm text-gray-600 mb-2">
                                Выберите группу
                            </div>
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg
                                         focus:ring-1 focus:ring-purple-600 focus:border-purple-600
                                         transition-colors duration-200"
                                value={requestData.group_id}
                                onChange={(e) =>
                                    setRequestData({
                                        ...requestData,
                                        group_id: e.target.value,
                                    })
                                }
                            >
                                <option value="" disabled>
                                    Выберите группу
                                </option>
                                {groups.map((group) => (
                                    <option value={group.id} key={group.id}>
                                        {group.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg
                                     hover:bg-purple-700 transition-colors duration-200
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={onSubmit}
                            disabled={
                                !requestData.name.trim() ||
                                !requestData.group_id
                            }
                        >
                            Отправить заявку
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentRequestForm;
