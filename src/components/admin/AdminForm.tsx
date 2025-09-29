import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { Admin } from "../../types";

interface AdminFormProps {
  mode: "add" | "edit";
  initialData: Admin | null;
  onSave: (data: Partial<Admin>) => void;
  onCancel: () => void;
}

const AdminForm = ({ mode, initialData, onSave, onCancel }: AdminFormProps) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<Partial<Admin>>({
    studentid: initialData?.studentid ?? "",
    adminusername: initialData?.adminusername ?? "",
    adminpassword: "",
  });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">
          {mode === "add" ? t("forms.admin.add") : t("forms.admin.edit")}
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Student ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("forms.admin.studentId")}
          </label>
          <input
            type="text"
            name="studentid"
            value={formData.studentid}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
            placeholder="e.g., AAU-1234-12"
          />
        </div>

        {/* Admin Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("forms.admin.adminUsername")}
          </label>
          <input
            type="text"
            name="adminusername"
            value={formData.adminusername}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
            placeholder="e.g., john_admin"
          />
        </div>

        {/* Admin Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("forms.admin.adminPassword")}
          </label>
          <input
            type="password"
            name="adminpassword"
            value={formData.adminpassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            placeholder={
              mode === "add"
                ? t("forms.admin.passwordPlaceholder")
                : "Update password if needed or leave blank"
            }
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            {t("forms.cancel")}
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {t("forms.save")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminForm;
