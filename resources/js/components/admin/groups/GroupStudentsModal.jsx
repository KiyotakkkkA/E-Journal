import { Icon } from "@iconify/react";
import { useEffect } from "react";

const GroupStudentsModal = ({ group, students, onClose, isOpen }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            <div
                className="modal show d-block"
                tabIndex="-1"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            >
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Студенты группы {group.name}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                            ></button>
                        </div>
                        <div className="modal-body">
                            {students.length === 0 ? (
                                <div className="text-center text-muted py-5">
                                    <Icon
                                        icon="mdi:account-group-outline"
                                        width="48"
                                        height="48"
                                        className="mb-3"
                                    />
                                    <p>В этой группе пока нет студентов</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>№</th>
                                                <th>Код студента</th>
                                                <th>ФИО</th>
                                                <th>Email</th>
                                                <th>Дата зачисления</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {students.map((student, index) => (
                                                <tr key={student.id}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <code>
                                                            {
                                                                student.student_code
                                                            }
                                                        </code>
                                                    </td>
                                                    <td>{student.user.name}</td>
                                                    <td>
                                                        {student.user.email}
                                                    </td>
                                                    <td>
                                                        {new Date(
                                                            student.created_at
                                                        ).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                            >
                                Закрыть
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GroupStudentsModal;
