import { useState, useCallback } from "react";
import { Admin, Role } from "../../types";

interface AdminFormProps {
  mode: "add" | "edit";
  initialData: Admin | null;
  roles: Role[];
  onSave: (data: Partial<Admin>) => void;
  onCancel: () => void;
}

export default function AdminModal({
  mode,
  initialData,
  roles,
  onSave,
  onCancel,
}: AdminFormProps) {
  const [formData, setFormData] = useState<Partial<Admin>>({
    studentid: initialData?.studentid ?? "",
    adminusername: initialData?.adminusername ?? "",
    adminpassword: "",
    roleName: initialData?.roleName ?? "",
  });
  const [error, setError] = useState<string>("");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      }));
      if (name === "adminpassword") {
        setError("");
      }
    },
    [],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      mode === "add" &&
      (!formData.adminpassword || formData.adminpassword.length < 8)
    ) {
      setError(
        "Password must be at least 8 characters long. Please try another.",
      );
      return;
    }
    if (
      mode === "edit" &&
      formData.adminpassword &&
      formData.adminpassword.length < 8
    ) {
      setError(
        "Password must be at least 8 characters long. Please try another.",
      );
      return;
    }

    if (mode === "add" && !formData.roleName?.trim()) {
      setError("Please select a role.");
      return;
    }

    onSave(formData);
    onCancel();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-300/40 p-7 animate-slideUp font-inter">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 id="modal-title" className="text-lg font-bold text-slate-800">
            {mode === "edit" ? "Edit Admin" : "Add New Admin"}
          </h2>
          <button
            onClick={onCancel}
            aria-label="Close modal"
            className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-red-50 hover:border-red-300 hover:text-red-500 transition-colors duration-150"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          autoComplete={mode === "add" ? "off" : undefined}
        >
          {/* ID */}
          <div className="flex flex-col gap-1.5 mb-4">
            <label
              htmlFor="admin-id"
              className="text-xs font-semibold text-slate-700 tracking-wide"
            >
              Student ID {mode === "edit" ? "(Read-only)" : ""}
            </label>
            <input
              id="admin-id"
              name="studentid"
              type="text"
              placeholder="UGR-1234-16"
              autoComplete={mode === "add" ? "off" : undefined}
              value={formData.studentid}
              autoFocus={mode !== "edit"}
              disabled={mode === "edit"}
              onChange={handleChange}
              className={`w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl outline-none placeholder-slate-300 transition-all duration-150 ${
                mode === "edit"
                  ? "bg-slate-100 text-slate-500 cursor-not-allowed"
                  : "text-slate-800 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              }`}
            />
          </div>

          {/* adminusername */}
          <div className="flex flex-col gap-1.5 mb-4">
            <label
              htmlFor="admin-adminusername"
              className="text-xs font-semibold text-slate-700 tracking-wide"
            >
              Admin Username
            </label>
            <input
              id="admin-adminusername"
              name="adminusername"
              type="text"
              autoComplete={mode === "add" ? "off" : undefined}
              value={formData.adminusername}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl outline-none placeholder-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-150"
            />
          </div>

          {mode === "add" && (
            <div className="flex flex-col gap-1.5 mb-4">
              <label
                htmlFor="admin-role"
                className="text-xs font-semibold text-slate-700 tracking-wide"
              >
                Role
              </label>
              <select
                id="admin-role"
                name="roleName"
                value={formData.roleName ?? ""}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-150"
              >
                <option value="" disabled>
                  Select role
                </option>
                {roles.map((role) => (
                  <option key={role.id ?? role.name} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Password */}
          <div className="flex flex-col gap-1.5 mb-4">
            <label
              htmlFor="admin-password"
              className="text-xs font-semibold text-slate-700 tracking-wide"
            >
              Admin Password
            </label>
            <input
              id="admin-password"
              name="adminpassword"
              type="password"
              autoComplete={mode === "add" ? "new-password" : undefined}
              value={formData.adminpassword}
              onChange={handleChange}
              className={`w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 border rounded-xl outline-none placeholder-slate-300 transition-all duration-150 ${
                error
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              }`}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-slate-500 border border-slate-200 rounded-xl hover:border-slate-300 hover:text-slate-700 transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-600 active:scale-95 rounded-xl shadow-md shadow-indigo-200 transition-all duration-150"
            >
              {mode === "edit" ? "Save Changes" : "Add Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
