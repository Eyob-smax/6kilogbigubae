// src/components/forms/UserForm.tsx
import { useState, ChangeEvent, FormEvent } from "react";
import { X } from "lucide-react";
import { User } from "../../types";

interface UserFormProps {
  mode: "add" | "edit";
  initialData: User | null;
  onCancel: () => void;
  onSubmit: (user: User) => void;
}

const defaultUser: User = {
  studentid: "",
  firstname: "",
  middlename: "",
  lastname: "",
  gender: "Male",
  baptismalname: "",
  phone: "",
  birthdate: new Date(),
  useremail: "",
  nationality: "Ethiopian",
  regionnumber: 10,
  mothertongue: "Not_Specified",
  zonename: "",
  isphysicallydisabled: "None",
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
  },
};

const role_type = [
  ["Member", "Member"],
  ["ClassSecretary", "Class Secretary"],
  ["ClassTeamLead", "Class TeamLead"],
  ["ClassManager", "Class Manager"],
  ["SubclassSecretary", "Subclass Secretary"],
  ["SubclassTeamLead", "Subclass TeamLead"],
  ["SubclassManager", "Subclass Manager"],
  ["None", "None"],
];

const participation_enum = [
  ["Batch_and_Programs_Coordination_Section", "Batch and coordination"],
  ["Gbi_Gubaye_Secretariat", "Secretariat"],
  ["Audit_and_Inspection_Section", "Audit and Inspection"],
  ["Education_and_Apostolic_Service_Section", "Education and Apostolic"],
  ["Accounting_and_Assets_Section", "Accounting and Assets"],
  ["Development_and_Income_Collection_Section", "Income collection"],
  ["Languages_and_Special_Interests_Section", "Language and special interests"],
  ["Hymns_and_Arts_Section", "Hymns and Arts"],
  [
    "Planning_Monitoring_Reports_and_Information_Management_Section",
    "Information management",
  ],
  ["Professional_and_Community_Development_Section", "Community development"],
  ["Member_Care_Advice_and_Capacity_Building_Section", "Member care advice"],
  ["None", "None"],
];

const universityusers_enum = [
  ["departmentname", "Department", "text", "required", "Computer Science"],
  ["batch", "Batch", "text", "required", "2016"],
  ["mealcard", "Meal Card", "text", "none", "8307"],
  ["confessionfather", "Confession father", "text", "none", "Abba Tesfaye"],
];

const user_enum = [
  ["studentid", "Student ID", "text", "required", "UGR-****-** USE(-)"],
  ["firstname", "First Name", "text", "required", "John"],
  ["middlename", "Middle Name", "text", "none", "Marcus"],
  ["lastname", "Last Name", "text", "required", "Doe"],
  ["baptismalname", "Baptismal Name", "text", "none", "Welde Amanuel"],
  ["phone", "Phone", "tel", "required", "+2519********"],
  [
    "birthdate",
    "Birthdate",
    "date",
    "required",
    new Date().toISOString().split("T")[0],
  ],
  ["useremail", "Email", "email", "none", "jhondoe@gmail.com"],
  ["regionnumber", "Region Number", "number", "none", 10],
  ["zonename", "Zone Name", "text", "borena", "Addis Ababa"],
  ["nationality", "Nationality", "text", "none", "Ethiopian"],
];

const mother_tongue_enum = [
  ["Amharic", "Amharic"],
  ["Oromifa", "Oromifa"],
  ["Tigregna", "Tigregna"],
  ["English", "English"],
  ["Not_Specified", "Not Specified"],
  ["Other", "Other"],
];

export default function UserForm({
  mode,
  initialData,
  onCancel,
  onSubmit,
}: UserFormProps) {
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
    <div className="p-6">
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {user_enum.map(([key, label, inputType, required, placeholder]) => (
            <div key={key as string}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label as string}
              </label>
              <input
                type={inputType as string}
                placeholder={required ? (placeholder as string) : ""}
                name={key as keyof User}
                required={required ? true : false}
                value={formData[key] || ""}
                onChange={handleChange}
                defaultValue={
                  key === "birthdate" && new Date().toISOString().split("T")[0]
                }
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          ))}

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
              Advisor
            </label>
            <select
              name="advisor"
              value={formData.universityusers?.advisors}
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
              value={formData.isphysicallydisabled}
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
              htmlFor="isphysimothertongue"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mother Tongue
            </label>
            <select
              id="mothertongue"
              name="mothertongue"
              value={formData.mothertongue}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  value={(formData.universityusers as any)[key] || ""}
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
              value={formData.universityusers?.sponsorshiptype}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="Government">Government</option>
              <option value=" Self_Sponsored"> Self_Sponsored</option>
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
        </div>

        <div className="flex justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
