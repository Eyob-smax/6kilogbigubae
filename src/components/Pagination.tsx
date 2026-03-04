import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPage: (page: number) => void;
  isLoading: boolean;
  limit: number;
  onLimitChange: (limit: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPage,
  isLoading,
  limit,
  onLimitChange,
}) => {
  const safeTotalPages = Math.max(1, totalPages);

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(safeTotalPages, currentPage + 2);
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  const handlePrevious = () => {
    if (currentPage > 1) onPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < safeTotalPages) onPage(currentPage + 1);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLimit = parseInt(e.target.value, 10);
    if (Number.isNaN(nextLimit)) return;

    onLimitChange(nextLimit);

    // Optional but common: changing page size usually resets pagination
    // (avoid landing on an out-of-range page)
    if (currentPage !== 1) onPage(1);
  };

  const baseBtn =
    "px-3 py-1 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1 || isLoading}
          className={`${baseBtn} bg-white text-liturgical-blue hover:bg-liturgical-blue/10`}
          aria-label="Previous page"
        >
          &lt; Previous
        </button>

        {pages.map((p) => {
          const isCurrent = p === currentPage;
          return (
            <button
              key={p}
              onClick={() => onPage(p)}
              disabled={isLoading || isCurrent}
              aria-current={isCurrent ? "page" : undefined}
              className={`${baseBtn} ${
                isCurrent
                  ? "bg-liturgical-blue text-white"
                  : "bg-white text-liturgical-blue hover:bg-liturgical-blue/10"
              }`}
            >
              {p}
            </button>
          );
        })}

        <button
          onClick={handleNext}
          disabled={currentPage === safeTotalPages || isLoading}
          className={`${baseBtn} bg-white text-liturgical-blue hover:bg-liturgical-blue/10`}
          aria-label="Next page"
        >
          Next &gt;
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span>Rows per page:</span>
        <select
          value={limit}
          onChange={handleLimitChange}
          disabled={isLoading}
          className="px-2 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Rows per page"
        >
          {[5, 10, 25, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Pagination;
