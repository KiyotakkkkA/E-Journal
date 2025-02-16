import GroupCard from "./GroupCard";

const GroupList = ({ groups, onShowStudents }) => {
    return (
        <div className="row g-4">
            {groups.map((group) => (
                <div key={group.id} className="col-md-6 col-lg-4">
                    <GroupCard group={group} onShowStudents={onShowStudents} />
                </div>
            ))}
        </div>
    );
};

export default GroupList;
