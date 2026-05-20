import { X } from "lucide-react";
import { UserFilters, EMPTY_USER_FILTERS } from "../types";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: UserFilters;
  onApply: (filters: UserFilters) => void;
}

const participationOptions = [
  "None",
  "Gbi_Gubaye_Secretariat",
  "Audit_and_Inspection_Section",
  "Education_and_Apostolic_Service_Section",
  "Accounting_and_Assets_Section",
  "Development_and_Income_Collection_Section",
  "Languages_and_Special_Interests_Section",
  "Hymns_and_Arts_Section",
  "Planning_Monitoring_Reports_and_Information_Management_Section",
  "Professional_and_Community_Development_Section",
  "Batch_and_Programs_Coordination_Section",
  "Member_Care_Advice_and_Capacity_Building_Section",
];

export default function FilterModal({
  isOpen,
  onClose,
  filters,
  onApply,
}: FilterModalProps) {
  if (!isOpen) return null;

  const getStringValue = (formData: FormData, key: string): string | null => {
    const value = formData.get(key);
    return typeof value === "string" && value.trim() !== "" ? value : null;
  };

  const getBooleanValue = (formData: FormData, key: string): boolean | null => {
    const value = formData.get(key);
    if (value === "true") return true;
    if (value === "false") return false;
    return null;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    onApply({
      gender: getStringValue(formData, "gender"),
      batch: getStringValue(formData, "batch")
        ? Number(getStringValue(formData, "batch"))
        : null,
      departmentname: getStringValue(formData, "departmentname"),
      clergicalstatus: getStringValue(formData, "clergicalstatus"),
      sponsorshiptype: getStringValue(formData, "sponsorshiptype"),
      cafeteriaaccess: getBooleanValue(formData, "cafeteriaaccess"),
      tookcourse: getBooleanValue(formData, "tookcourse"),
      participation: getStringValue(formData, "participation"),
    });
    onClose();
  };

  const handleClear = () => {
    onApply({ ...EMPTY_USER_FILTERS });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Filter Students</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close filter modal"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                name="gender"
                defaultValue={filters.gender || ""}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">All</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Batch (Year)
              </label>
              <input
                name="batch"
                type="number"
                min="2000"
                max="2030"
                defaultValue={filters.batch || ""}
                placeholder="e.g. 2016, 2017"
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                Department
              </label>
              <input
                name="departmentname"
                defaultValue={filters.departmentname || ""}
                placeholder="Search department"
                maxLength={100}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Clergy Status
              </label>
              <select
                name="clergicalstatus"
                defaultValue={filters.clergicalstatus || ""}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">All</option>
                <option value="None">None</option>
                <option value="Deacon">Deacon</option>
                <option value="Priest">Priest</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Sponsorship
              </label>
              <select
                name="sponsorshiptype"
                defaultValue={filters.sponsorshiptype || ""}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">All</option>
                <option value="Government">Government</option>
                <option value="Self_Sponsored">Self Sponsored</option>
                <option value="Scholarship">Scholarship</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Cafeteria Access
              </label>
              <select
                name="cafeteriaaccess"
                defaultValue={
                  filters.cafeteriaaccess === null
                    ? ""
                    : String(filters.cafeteriaaccess)
                }
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">All</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Took Course
              </label>
              <select
                name="tookcourse"
                defaultValue={
                  filters.tookcourse === null ? "" : String(filters.tookcourse)
                }
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">All</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                Participation
              </label>
              <select
                name="participation"
                defaultValue={filters.participation || ""}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">All</option>
                {participationOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Clear All
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
