import { Icon } from "@iconify/react";

const GroupCard = ({ group, onShowStudents }) => {
    const handleDropdownClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div
            className="card h-100"
            style={{ cursor: "pointer" }}
            onClick={() => onShowStudents(group)}
        >
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                    <h5 className="card-title mb-2">{group.name}</h5>
                    <div className="dropdown" onClick={handleDropdownClick}>
                        <button
                            className="btn btn-link text-muted"
                            data-bs-toggle="dropdown"
                        >
                            <Icon icon="mdi:dots-vertical" />
                        </button>
                        <ul className="dropdown-menu">
                            <li>
                                <button className="dropdown-item">
                                    <Icon icon="mdi:pencil" className="me-2" />
                                    Редактировать
                                </button>
                            </li>
                            <li>
                                <button className="dropdown-item text-danger">
                                    <Icon icon="mdi:delete" className="me-2" />
                                    Удалить
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
                <p className="card-text text-muted mb-3">{group.description}</p>
                <div className="d-flex align-items-center gap-2">
                    <Icon icon="mdi:account-group" />
                    <span>
                        {group.students_count || 0} / {group.max_students}{" "}
                        студентов
                    </span>
                </div>
            </div>
        </div>
    );
};

export default GroupCard;
