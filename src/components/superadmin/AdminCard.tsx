import { useEffect, useMemo, useRef, useState } from "react";
import {
  Admin,
  Permissions,
  PERMISSION_META,
  DEFAULT_PERMISSIONS,
} from "../../types";

interface Props {
  admin: Admin;
  onEdit: (admin: Admin) => void;
  onDelete: (admin: Admin) => void;
  onSavePermissions: (admin: Admin, permissions: Permissions) => void;
}

export default function AdminCard({
  admin,
  onEdit,
  onDelete,
  onSavePermissions,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const panelContentRef = useRef<HTMLDivElement | null>(null);
  const [panelMaxHeight, setPanelMaxHeight] = useState("0px");
  const safePermissions = useMemo<Permissions>(
    () => ({
      ...DEFAULT_PERMISSIONS,
      ...(admin.permissions ?? {}),
    }),
    [admin.permissions],
  );
  const [draftPermissions, setDraftPermissions] =
    useState<Permissions>(safePermissions);

  useEffect(() => {
    setDraftPermissions(safePermissions);
  }, [safePermissions]);

  useEffect(() => {
    if (!expanded) {
      setPanelMaxHeight("0px");
      return;
    }

    const nextHeight = panelContentRef.current?.scrollHeight ?? 0;
    setPanelMaxHeight(`${nextHeight}px`);
  }, [expanded, draftPermissions]);

  const hasPermissionChanges = PERMISSION_META.some(
    ({ key }) => draftPermissions[key] !== safePermissions[key],
  );

  const activeCount = Object.values(safePermissions).filter(Boolean).length;
  const usersCreatedCount = admin.usersCreatedCount ?? 0;
  const createdAtLabel = admin?.createdAt
    ? new Date(admin.createdAt).toLocaleDateString()
    : "Not available";

  const accessSummary = [
    {
      title: "Read",
      value: safePermissions.readUsers ? "All users" : "Scoped/none",
    },
    {
      title: "Register",
      value: safePermissions.registerUsers ? "Allowed" : "Denied",
    },
    {
      title: "Edit",
      value: safePermissions.editAnyUser
        ? "Any user"
        : safePermissions.editSpecificUsers || safePermissions.registerUsers
          ? "Own users"
          : "Denied",
    },
    {
      title: "Delete",
      value: safePermissions.removeAnyUsers
        ? "Any user"
        : safePermissions.removeSpecificUsers || safePermissions.registerUsers
          ? "Own users"
          : "Denied",
    },
  ];

  return (
    <div
      className={` transition-all duration-200 overflow-hidden font-inter bg-slate-200/20
                ${
                  expanded
                    ? "border-indigo-300 shadow-lg shadow-indigo-100"
                    : "border-slate-200 shadow-sm hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-50"
                }`}
    >
      {/* Header row */}
      <div
        className="flex items-center gap-3 px-5 py-4 cursor-pointer select-none"
        onClick={() => setExpanded((v) => !v)}
        role="button"
        aria-expanded={expanded}
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setExpanded((v) => !v)}
      >
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-slate-800 truncate">
            {admin.studentid}
          </div>
          <div className="text-xs text-slate-400 mt-0.5 truncate">
            {admin.adminusername}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {admin.role || "Admin"}
            </span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                admin.isSuperAdmin
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
              }`}
            >
              {admin.isSuperAdmin ? "Super Admin" : "Regular Admin"}
            </span>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Added {createdAtLabel}
            </span>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Created users: {usersCreatedCount}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {activeCount > 0 && (
            <span
              title={`${activeCount} permission(s) active`}
              className="text-xs font-semibold text-indigo-500 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full"
            >
              {activeCount}
            </span>
          )}

          {/* Edit button */}
          <button
            className={
              admin.isSuperAdmin
                ? "w-8 h-8 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-400  hover:border-red-300 hover:text-indigo-500 transition-colors duration-150 cursor-not-allowed"
                : "w-8 h-8 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-500 transition-colors duration-150"
            }
            title="Edit admin details"
            aria-label="Edit admin"
            disabled={admin.isSuperAdmin}
            onClick={(e) => {
              e.stopPropagation();
              if (admin.isSuperAdmin) return;
              onEdit(admin);
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>

          <button
            className={
              admin.isSuperAdmin
                ? "w-8 h-8 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-400  hover:border-red-300  transition-colors duration-150 cursor-not-allowed"
                : "w-8 h-8 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-red-50 hover:border-red-300 hover:text-red-500 transition-colors duration-150"
            }
            title="Delete admin"
            aria-label="Delete admin"
            disabled={admin.isSuperAdmin}
            onClick={(e) => {
              e.stopPropagation();
              if (admin.isSuperAdmin) return;
              onDelete(admin);
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>

          {/* Chevron */}
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${expanded ? "rotate-180 text-indigo-500" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Permissions panel — inside the card container */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: panelMaxHeight }}
      >
        <div
          ref={panelContentRef}
          className="px-5 pb-5 pt-1 bg-white/90 border-t border-slate-100/80"
        >
          <div className="mt-3 mb-3 flex items-center justify-between gap-3">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              Permissions
            </p>
            {hasPermissionChanges && (
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">
                Unsaved changes
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {PERMISSION_META.map(({ key, label, description }) => (
              <div
                key={key}
                className="flex items-center justify-between gap-4 px-3.5 py-3 rounded-xl bg-slate-200/40 border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/40 transition-colors duration-150"
              >
                {/* Label group */}
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-sm font-medium text-slate-700">
                    {label}
                  </span>
                  <span className="text-xs text-slate-400">{description}</span>
                </div>

                {/* Toggle switch */}
                <label
                  className="relative inline-flex items-center flex-shrink-0 cursor-pointer group"
                  title={`Toggle ${label}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={draftPermissions[key]}
                    disabled={admin.isSuperAdmin}
                    onChange={() =>
                      setDraftPermissions((prev) => ({
                        ...prev,
                        [key]: !prev[key],
                      }))
                    }
                  />

                  <div className="w-11 h-6 bg-slate-400/50 border border-slate-700 rounded-full transition-colors duration-200 ease-in-out peer-checked:bg-sky-600/80 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500/50" />

                  <div className="absolute left-[2px] top-[2px] flex items-center justify-center w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out peer-checked:translate-x-5">
                    {draftPermissions[key] ? (
                      <svg
                        className="w-3 h-3 text-green-400"
                        fill="currentColor"
                        viewBox="0 0 12 12"
                      >
                        <path d="M3.707 5.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L5 6.586 3.707 5.293z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-3 h-3 text-red-400"
                        fill="currentColor"
                        viewBox="0 0 12 12"
                      >
                        <path d="M3.707 3.293a1 1 0 00-1.414 1.414L4.586 7 2.293 9.293a1 1 0 101.414 1.414L6 8.414l2.293 2.293a1 1 0 001.414-1.414L7.414 7l2.293-2.293a1 1 0 00-1.414-1.414L6 5.586 3.707 3.293z" />
                      </svg>
                    )}
                  </div>
                </label>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSavePermissions(admin, draftPermissions);
              }}
              disabled={!hasPermissionChanges}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-300 transition-colors duration-150"
            >
              Save Permissions
            </button>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-4">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
              Access Profile
            </p>
            <div className="grid grid-cols-2 gap-2">
              {accessSummary.map((item) => (
                <div
                  key={item.title}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-2"
                >
                  <p className="text-[11px] font-semibold text-slate-500">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-700 mt-0.5">{item.value}</p>
                </div>
              ))}
              <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 col-span-2">
                <p className="text-[11px] font-semibold text-slate-500">
                  Users Created
                </p>
                <p className="text-xs text-slate-700 mt-0.5">
                  {usersCreatedCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
