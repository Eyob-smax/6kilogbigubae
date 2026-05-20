import { useState } from "react";
import { DEFAULT_PERMISSIONS, PERMISSION_META, Role } from "../../types";

interface RoleModalProps {
  mode: "add" | "edit";
  initialData: Role | null;
  onSave: (data: Partial<Role>) => void;
  onCancel: () => void;
}

export default function RoleModal({
  mode,
  initialData,
  onSave,
  onCancel,
}: RoleModalProps) {
  const [formData, setFormData] = useState<Partial<Role>>({
    name: initialData?.name ?? "",
    readUsers: initialData?.readUsers ?? DEFAULT_PERMISSIONS.readUsers,
    registerUsers:
      initialData?.registerUsers ?? DEFAULT_PERMISSIONS.registerUsers,
    editAnyUser: initialData?.editAnyUser ?? DEFAULT_PERMISSIONS.editAnyUser,
    editSpecificUsers:
      initialData?.editSpecificUsers ?? DEFAULT_PERMISSIONS.editSpecificUsers,
    removeAnyUsers:
      initialData?.removeAnyUsers ?? DEFAULT_PERMISSIONS.removeAnyUsers,
    removeSpecificUsers:
      initialData?.removeSpecificUsers ??
      DEFAULT_PERMISSIONS.removeSpecificUsers,
  });
  const [nameError, setNameError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "name") {
      setNameError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = formData.name?.trim() ?? "";
    if (!trimmedName) {
      setNameError("Role name is required.");
      return;
    }

    onSave({
      ...DEFAULT_PERMISSIONS,
      ...formData,
      name: trimmedName,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="role-modal-title"
    >
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-300/40 p-7 animate-slideUp font-inter">
        <div className="flex items-center justify-between mb-6">
          <h2
            id="role-modal-title"
            className="text-lg font-bold text-slate-800"
          >
            {mode === "edit" ? "Edit Role" : "Add New Role"}
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

        <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-1.5 mb-5">
            <label
              htmlFor="role-name"
              className="text-xs font-semibold text-slate-700 tracking-wide"
            >
              Role Name
            </label>
            <input
              id="role-name"
              name="name"
              type="text"
              value={formData.name ?? ""}
              onChange={handleChange}
              autoFocus
              className={`w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 border rounded-xl outline-none placeholder-slate-300 transition-all duration-150 ${
                nameError
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              }`}
              placeholder="e.g. Users Manager"
            />
            {nameError && (
              <p className="text-xs text-red-500 mt-1">{nameError}</p>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-700 tracking-wide mb-3">
              Permissions
            </p>
            <div className="flex flex-col gap-2">
              {PERMISSION_META.map(({ key, label, description }) => (
                <label
                  key={key}
                  className="flex items-center justify-between gap-4 px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-100 transition-colors"
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-sm font-medium text-slate-700">
                      {label}
                    </span>
                    <span className="text-xs text-slate-400">
                      {description}
                    </span>
                  </div>
                  <span className="relative inline-flex items-center flex-shrink-0 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      name={key}
                      checked={Boolean(formData[key])}
                      onChange={handleChange}
                    />
                    <span className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-indigo-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white" />
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-7">
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
              {mode === "edit" ? "Save Changes" : "Add Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
