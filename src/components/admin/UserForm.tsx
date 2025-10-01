// src/components/forms/UserForm.tsx
import { useState, ChangeEvent, FormEvent, memo } from "react";
import { X } from "lucide-react";
import { UniversityUser, User } from "../../types";

interface UserFormProps {
  mode: "add" | "edit";
  initialData: User | null;
  onCancel: () => void;
  onSubmit: (user: User) => void;
}

const defaultUser: User = {
  studentid: "UGR-",
  firstname: "",
  middlename: "",
  lastname: "",
  gender: "Male",
  baptismalname: "",
  phone: "",
  birthdate: new Date(),
  useremail: "",
  telegram_username: "",
  nationality: "Ethiopian",
  region: "Addis_Ababa",
  mothertongue: "Amharic",
  zonename: "",
  isphysicallydisabled: "None",
  clergicalstatus: "None",
  universityusers: {
    departmentname: "",
    sponsorshiptype: "Government",
    participation: "None",
    batch: 2016,
    confessionfather: "",
    advisors: "Yes",
    role: "Member",
    mealcard: "",
    cafeteriaaccess: true,
    holidayincampus: false,
    tookcourse: true,
    activitylevel: "Active",
  },
};

const role_type = [
  ["Member", "Member"],
  ["ClassSecretary", "Class Secretary"],
  ["ClassTeamLead", "Class TeamLead"],
  ["ClassManager", "Class Manager"],
  ["SubclassSecretary", "Subclass Secretary"],
  ["SubclassTeamLead", "SubclassTeamLead"],
  ["SubclassManager", "Subclass Manager"],
  ["None", "None"],
];

const participation_enum: [string, string][] = [
  ["Gbi_Gubaye_Secretariat", "የግቢ ጉባኤው ጽ/ቤት"],
  ["Audit_and_Inspection_Section", "ኦዲትና ኢንስፔክሽን ክፍል"],
  ["Education_and_Apostolic_Service_Section", "ትምህርትና ሐዋርያው አገልግሎት ክፍል"],
  ["Accounting_and_Assets_Section", "የሒሳብና ንብረት ክፍል"],
  ["Development_and_Income_Collection_Section", "ልማትና ገቢ አሰባሰብ ክፍል"],
  ["Languages_and_Special_Interests_Section", "ቋንቋዎችና ልዩ ፍላጎት ክፍል"],
  ["Hymns_and_Arts_Section", "መዝሙርና ስነ ጥበባት ክፍል"],
  [
    "Planning_Monitoring_Reports_and_Information_Management_Section",
    "ዕቅድ ክትትል ሪፓርትና መረጃ ማደራጃ ክፍል",
  ],
  ["Professional_and_Community_Development_Section", "የሞያና በጎ አድራጎት ክፍል"],
  ["Batch_and_Programs_Coordination_Section", "የባችና መርሀግራት ማስተባበሪያ ክፍል"],
  [
    "Member_Care_Advice_and_Capacity_Building_Section",
    "የአባላት እንክብካቤ ምክክርና አቅም ማጎልበቻ ክፍል",
  ],
  ["None", "ምንም አይደለም"],
];

const universityusers_enum = [
  ["departmentname", "Department", "text", "required", "Information System"],
  ["batch", "Batch", "number", "required", "2016"],
  ["mealcard", "Meal Card(optional)", "text", "optional", "8307"],
  [
    "confessionfather",
    "Conf. father(optional)",
    "text",
    "optional",
    "Abba Tesfaye",
  ],
];

const region_enum = [
  ["Addis_Ababa", "Addis Ababa"],
  ["Dire_Dawa", "Dire Dawa"],
  ["Afar", "Afar"],
  ["Amhara", "Amhara"],
  ["Oromia", "Oromia"],
  ["Somali", "Somali"],
  ["Benishangul_Gumuz", "Benishangul-Gumuz"],
  ["SNNPR", "SNNPR"],
  ["Sidama", "Sidama"],
  ["South_West_Ethiopia_Peoples_Region", "South West Ethiopia Peoples Region"],
  ["Central_Ethiopia_Region", "Central Ethiopia Region"],
  ["South_Ethiopia_Region", "South Ethiopia Region"],
  ["Harari", "Harari"],
  ["Not_Specified", "Not Specified"],
];

const user_enum = [
  ["studentid", "Student ID", "text", "required", "UGR-****-** USE(-)"],
  ["firstname", "First Name", "text", "required", "Berhanu"],
  ["lastname", "Father's Name", "text", "required", "Tesfaye"],
  ["middlename", "GrandFather's Name", "text", "optional", "Amanuel"],
  [
    "baptismalname",
    "Baptismal Name(optional)",
    "text",
    "optional",
    "Welde Amanuel",
  ],
  ["phone", "Phone", "tel", "required", "+2519********"],
  [
    "birthdate",
    "Birthdate",
    "date",
    "required",
    new Date().toISOString().split("T")[0],
  ],
  [
    "telegram_username",
    "Telegram Username(optional)",
    "text",
    "optional",
    "@berhanu123",
  ],
  ["useremail", "Email", "email", "optional", "someone@gmail.com"],
  ["zonename", "Zone(optional)", "text", "optional", "Gedeo"],
  ["nationality", "Nationality", "text", "required", "Ethiopian"],
];

const mother_tongue_enum = [
  ["Amharic", "Amharic"],
  ["Oromifa", "Oromifa"],
  ["Tigrigna", "Tigregna"],
  ["English", "English"],
  ["Not_Specified", "Not Specified"],
  ["Other", "Other"],
];

function getUniversityUserValue<K extends keyof UniversityUser>(
  obj: UniversityUser | undefined,
  key: K
): string | number {
  const value = obj?.[key];
  return (value ?? "").toString();
}

function UserForm({ mode, initialData, onCancel, onSubmit }: UserFormProps) {
  const [formData, setFormData] = useState<User>(initialData || defaultUser);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof User] as object),
          [child]: checked !== undefined ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: checked !== undefined ? checked : value,
      }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSubmit(formData);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">
          {mode === "add" ? "Add User" : "Edit User"}
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Close form"
        >
          <X size={24} />
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 overflow-y-auto max-h-[70vh]"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {user_enum.map(
            ([key, label, inputType, required, placeholder, defaultValue]) => (
              <div key={key as string}>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">
                  {label as string}
                </label>
                <input
                  type={inputType as string}
                  placeholder={required ? (placeholder as string) : ""}
                  name={key as keyof User}
                  defaultValue={
                    defaultValue !== "none"
                      ? (defaultValue as string)
                      : undefined
                  }
                  required={required === "required" ? true : false}
                  value={
                    key === "birthdate"
                      ? new Date(formData[key as keyof User] as Date)
                          .toISOString()
                          .split("T")[0]
                      : (formData[key as keyof User] as string | number) ?? ""
                  }
                  onChange={handleChange}
                  className="w-full text-sm px-3 py-2 border rounded-md"
                />
              </div>
            )
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Region
            </label>
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              {region_enum.map(([value, text]) => {
                return (
                  <option key={value} value={value}>
                    {text}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              has Advisor(family)?
            </label>
            <select
              name="universityusers.advisors"
              value={formData?.universityusers?.advisors}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="isphysicallydisabled"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Any kind of impairment?
            </label>
            <select
              id="isphysicallydisabled"
              name="isphysicallydisabled"
              value={formData?.isphysicallydisabled}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="None">None</option>
              <option value="Physical">Physical</option>
              <option value="Visual">Visual</option>
              <option value="Hearing">Hearing</option>
              <option value="Intellectual">Intellectual</option>
              <option value="Psychosocial">Psychosocial</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="mothertongue"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mother Tongue
            </label>
            <select
              id="mothertongue"
              name="mothertongue"
              value={formData?.mothertongue}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              {mother_tongue_enum.map(([value, text]) => {
                return (
                  <option key={value} value={value}>
                    {text}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <h4 className="text-md font-semibold pt-6">University Information</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {universityusers_enum.map(
            ([key, label, inputType, required, placeholder]) => (
              <div key={`universityusers.${key}`}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label}
                </label>
                <input
                  placeholder={placeholder === "none" ? "" : placeholder}
                  type={inputType}
                  required={required === "required" ? true : false}
                  name={`universityusers.${key}`}
                  value={getUniversityUserValue(
                    formData.universityusers,
                    key as keyof UniversityUser
                  )}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            )
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sponsorship Type
            </label>
            <select
              name="universityusers.sponsorshiptype"
              value={formData?.universityusers?.sponsorshiptype}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="Government">Government</option>
              <option value="Self_Sponsored">Self_Sponsored</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Participation
            </label>
            <select
              name="universityusers.participation"
              value={formData.universityusers?.participation}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              {participation_enum.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              name="universityusers.role"
              value={formData?.universityusers?.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              {role_type.map(([value, text]) => {
                return (
                  <option key={value} value={value}>
                    {text}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Activity Level
            </label>
            <select
              name="universityusers.activitylevel"
              value={formData?.universityusers?.activitylevel}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="Active">Active</option>
              <option value="Very_Active">Very Active</option>
              <option value="Less_Active">Less Active</option>
              <option value="Not_Active">Not Active</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clergy Status(if any)
            </label>
            <select
              name="universityusers.clergicalstatus"
              value={formData?.clergicalstatus}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="None">Not Clergy</option>
              <option value="Deacon">Deacon</option>
              <option value="Priest">Priest</option>
            </select>
          </div>

          <div className="flex items-center pt-6">
            <input
              type="checkbox"
              name="universityusers.cafeteriaaccess"
              checked={formData?.universityusers?.cafeteriaaccess}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">
              Cafeteria Access
            </label>
          </div>
          <div className="flex items-center pt-6">
            <input
              type="checkbox"
              name="universityusers.holidayincampus"
              checked={formData?.universityusers?.holidayincampus}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">
              Holiday in Campus
            </label>
          </div>
          <div className="flex items-center pt-6">
            <input
              type="checkbox"
              name="universityusers.tookcourse"
              checked={formData?.universityusers?.tookcourse}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">took course?</label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

const UserFormMemo = memo(UserForm);
export default UserFormMemo;
