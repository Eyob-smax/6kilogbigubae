import { useState, useMemo, useRef, useEffect } from "react";
import { Role, PERMISSION_META } from "../../types";

interface Props {
  role: Role;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
  onSavePermissions: (role: Role, permissions: Partial<Role>) => void;
}

export default function RoleCard({
  role,
  onEdit,
  onDelete,
  onSavePermissions,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const panelContentRef = useRef<HTMLDivElement | null>(null);
  const [panelMaxHeight, setPanelMaxHeight] = useState("0px");

  const [draftPermissions, setDraftPermissions] = useState<Partial<Role>>({
    readUsers: role.readUsers,
    registerUsers: role.registerUsers,
    editAnyUser: role.editAnyUser,
    editSpecificUsers: role.editSpecificUsers,
    removeAnyUsers: role.removeAnyUsers,
    removeSpecificUsers: role.removeSpecificUsers,
  });

  useEffect(() => {
    setDraftPermissions({
      readUsers: role.readUsers,
      registerUsers: role.registerUsers,
      editAnyUser: role.editAnyUser,
      editSpecificUsers: role.editSpecificUsers,
      removeAnyUsers: role.removeAnyUsers,
      removeSpecificUsers: role.removeSpecificUsers,
    });
  }, [role]);

  useEffect(() => {
    if (!expanded) {
      setPanelMaxHeight("0px");
      return;
    }
    const nextHeight = panelContentRef.current?.scrollHeight ?? 0;
    setPanelMaxHeight(`${nextHeight}px`);
  }, [expanded, draftPermissions]);

  const hasPermissionChanges = useMemo(() => {
    return PERMISSION_META.some(
      ({ key }) => (draftPermissions as any)[key] !== (role as any)[key],
    );
  }, [draftPermissions, role]);

  const activeCount = Object.values(draftPermissions).filter(Boolean).length;

  return (
    <div
      className={`transition-all duration-200 overflow-hidden font-inter bg-slate-200/20 rounded-xl border ${
        expanded
          ? "border-indigo-300 shadow-lg shadow-indigo-100"
          : "border-slate-200 shadow-sm hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-50"
      }`}
    >
      <div
        className="flex items-center gap-3 px-5 py-4 cursor-pointer select-none"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-slate-800 truncate">
            {role.name}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Role ID: {role.id}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {activeCount} Permissions Active
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(role);
            }}
            className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-500 transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(role);
            }}
            className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-red-50 hover:border-red-300 hover:text-red-500 transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${expanded ? "rotate-180 text-indigo-500" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: panelMaxHeight }}
      >
        <div
          ref={panelContentRef}
          className="px-5 pb-5 pt-1 bg-white/90 border-t border-slate-100"
        >
          <div className="mt-3 mb-3 flex items-center justify-between">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              Assign Permissions
            </p>
            {hasPermissionChanges && (
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">
                Unsaved Changes
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {PERMISSION_META.map(({ key, label, description }) => (
              <div
                key={key}
                className="flex items-center justify-between gap-4 px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-100 transition-colors"
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-sm font-medium text-slate-700">
                    {label}
                  </span>
                  <span className="text-xs text-slate-400">{description}</span>
                </div>

                <label className="relative inline-flex items-center flex-shrink-0 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={(draftPermissions as any)[key]}
                    onChange={() =>
                      setDraftPermissions((prev) => ({
                        ...prev,
                        [key]: !(prev as any)[key],
                      }))
                    }
                  />
                  <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-indigo-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                </label>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => onSavePermissions(role, draftPermissions)}
              disabled={!hasPermissionChanges}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 disabled:bg-slate-300 transition-colors"
            >
              Update Permissions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
