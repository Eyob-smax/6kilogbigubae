import { useEffect, useState } from "react";
import { Filter } from "lucide-react";
import useDebounce from "../customhook/useDebounce";
import useUsers from "../service/useUsers";
import Pagination from "../components/Pagination";
import FilterModal from "../components/FilterModal";
import { EMPTY_USER_FILTERS } from "../types";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>(undefined);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ ...EMPTY_USER_FILTERS });

  const debouncedQ = useDebounce(q, 300);

  useEffect(() => {
    setPage(1);
  }, [debouncedQ, limit, sortBy, sortOrder, filters]);

  const { data, isLoading, isError } = useUsers({
    page,
    limit,
    q: debouncedQ,
    sortBy,
    sortOrder,
    ...filters,
  });

  const totalPages = data?.pagination?.totalPages ?? 1;

  const handleLimitChange = (n: number) => {
    setLimit(n);
    setPage(1);
  };

  const users = data?.users ?? [];

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Manage Users</h1>
      <p className="text-sm text-gray-600 mb-4">
        {data?.pagination?.totalUsers ?? users.length} users found
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <input
            aria-label="Search users"
            className="w-full sm:w-64 px-3 py-2 border rounded"
            placeholder="Search by name or id"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="px-2 py-2 border rounded"
            value={sortBy || ""}
            onChange={(e) => setSortBy(e.target.value || undefined)}
          >
            <option value="">Sort by</option>
            <option value="firstname">First name</option>
            <option value="lastname">Last name</option>
          </select>
          <select
            className="px-2 py-2 border rounded"
            value={sortOrder || ""}
            onChange={(e) => {
              const val = e.target.value;
              setSortOrder(val === "asc" || val === "desc" ? val : undefined);
            }}
          >
            <option value="">Order</option>
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>

        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Filter size={18} />
          Filters
        </button>
      </div>

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onApply={setFilters}
      />

      <div className="space-y-3">
        {isLoading && (
          <div className="space-y-2">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        )}

        {isError && <div className="text-red-600">Failed to load users.</div>}

        {!isLoading && users.length === 0 && (
          <div className="text-gray-600">No users found.</div>
        )}

        {!isLoading && users.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto bg-white rounded shadow">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Student ID
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Phone
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Department
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Batch
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((u) => {
                  const fullname = [u.firstname, u.middlename, u.lastname]
                    .filter(Boolean)
                    .join(" ");
                  return (
                    <tr key={u.studentid} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {u.studentid}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {fullname}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {u.phone}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {u.universityusers?.departmentname ?? "-"}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {u.universityusers?.batch ?? "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPage={(p) => setPage(p)}
          isLoading={isLoading}
          limit={limit}
          onLimitChange={handleLimitChange}
        />
      </div>
    </div>
  );
}
