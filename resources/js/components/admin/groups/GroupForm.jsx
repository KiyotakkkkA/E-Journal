import { Icon } from "@iconify/react";

const GroupForm = ({ newGroup, setNewGroup, errors, onSubmit, onCancel }) => {
    return (
        <div className="card mb-4">
            <div className="card-body">
                <h5 className="card-title mb-3">Новая группа</h5>
                <form onSubmit={onSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Название группы</label>
                        <input
                            type="text"
                            className={`form-control ${
                                errors.name ? "is-invalid" : ""
                            }`}
                            value={newGroup.name}
                            onChange={(e) =>
                                setNewGroup({
                                    ...newGroup,
                                    name: e.target.value,
                                })
                            }
                        />
                        {errors.name && (
                            <div className="invalid-feedback">
                                {errors.name}
                            </div>
                        )}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">
                            Максимальное количество студентов
                        </label>
                        <input
                            type="number"
                            className={`form-control ${
                                errors.max_students ? "is-invalid" : ""
                            }`}
                            value={newGroup.max_students}
                            onChange={(e) =>
                                setNewGroup({
                                    ...newGroup,
                                    max_students: e.target.value,
                                })
                            }
                            min="1"
                            max="30"
                        />
                        {errors.max_students && (
                            <div className="invalid-feedback">
                                {errors.max_students}
                            </div>
                        )}
                    </div>
                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-purple">
                            Создать группу
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onCancel}
                        >
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GroupForm;
