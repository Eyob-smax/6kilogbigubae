import { X } from "lucide-react";
import { User } from "../../types";

interface UserDetailProps {
  user: User;
  onClose: () => void;
}

const UserDetail = ({ user, onClose }: UserDetailProps) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Student Details</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
      </div>

      <div className="space-y-6 max-h-[70vh] overflow-y-auto">
        <div>
          <h4 className="text-lg font-semibold mb-3 text-liturgical-blue">Personal Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailField label="Student ID" value={user.studentid} />
            <DetailField label="Full Name" value={`${user.firstname} ${user.middlename} ${user.lastname}`} />
            <DetailField label="Baptismal Name" value={user.baptismalname} />
            <DetailField label="Gender" value={user.gender} />
            <DetailField label="Phone" value={user.phone} />
            <DetailField label="Email" value={user.useremail || "N/A"} />
            <DetailField label="Telegram" value={user.telegram_username || "N/A"} />
            <DetailField label="Birth Date" value={new Date(user.birthdate).toLocaleDateString()} />
            <DetailField label="Nationality" value={user.nationality} />
            <DetailField label="Region" value={user.region.replace(/_/g, " ")} />
            <DetailField label="Zone" value={user.zonename || "N/A"} />
            <DetailField label="Mother Tongue" value={user.mothertongue} />
            <DetailField label="Physical Impairment" value={user.isphysicallydisabled} />
            <DetailField label="Clergy Status" value={user.clergicalstatus || "None"} />
          </div>
        </div>

        {user.universityusers && (
          <div>
            <h4 className="text-lg font-semibold mb-3 text-liturgical-blue">University Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailField label="Department" value={user.universityusers.departmentname} />
              <DetailField label="Batch" value={user.universityusers.batch.toString()} />
              <DetailField label="Sponsorship" value={user.universityusers.sponsorshiptype.replace(/_/g, " ")} />
              <DetailField label="Participation" value={user.universityusers.participation.replace(/_/g, " ")} />
              <DetailField label="Role" value={user.universityusers.role.replace(/_/g, " ")} />
              <DetailField label="Activity Level" value={user.universityusers.activitylevel.replace(/_/g, " ")} />
              <DetailField label="Confession Father" value={user.universityusers.confessionfather || "N/A"} />
              <DetailField label="Has Advisor" value={user.universityusers.advisors} />
              <DetailField label="Meal Card" value={user.universityusers.mealcard || "N/A"} />
              <DetailField label="Cafeteria Access" value={user.universityusers.cafeteriaaccess ? "Yes" : "No"} />
              <DetailField label="Cafeteria Name" value={user.universityusers.cafeterianame || "N/A"} />
              <DetailField label="Holiday in Campus" value={user.universityusers.holidayincampus ? "Yes" : "No"} />
              <DetailField label="Took Course" value={user.universityusers.tookcourse ? "Yes" : "No"} />
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button onClick={onClose} className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
          Close
        </button>
      </div>
    </div>
  );
};

const DetailField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-base text-gray-900 mt-1">{value}</p>
  </div>
);

export default UserDetail;
