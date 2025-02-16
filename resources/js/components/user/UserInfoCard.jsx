import { Icon } from "@iconify/react";

const UserInfoCard = ({ title, icon, value, colSize }) => {
    return (
        <div className={`col-md-${colSize}`}>
            <div className="card bg-light">
                <div className="card-body">
                    <h6 className="card-subtitle mb-2 text-muted">
                        <Icon icon={icon} className="me-2" />
                        {title}
                    </h6>
                    <p className="card-text">{value}</p>
                </div>
            </div>
        </div>
    );
};

export default UserInfoCard;
