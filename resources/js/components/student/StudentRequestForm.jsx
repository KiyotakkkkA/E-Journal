const StudentRequestForm = ({
    requestData,
    setRequestData,
    groups,
    onSubmit,
}) => {
    return (
        <div className="col-md-6 mt-3">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">
                        Заявка на прикрепление к группе
                    </h5>
                    <div className="card-text">
                        <div className="mb-2 text-muted">
                            Введите ФИО студента
                        </div>
                        <input
                            type="text"
                            className="form-control"
                            value={requestData.name}
                            onChange={(e) =>
                                setRequestData({
                                    ...requestData,
                                    name: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="card-text">
                        <div className="mb-2 text-muted">Выберите группу</div>
                        <select
                            className="form-select"
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
                        className="btn btn-purple mt-3"
                        onClick={onSubmit}
                        disabled={
                            !requestData.name.trim() || !requestData.group_id
                        }
                    >
                        Отправить заявку
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentRequestForm;
