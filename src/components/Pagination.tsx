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
  const handlePrevious = () => {
    if (currentPage > 1) onPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPage(currentPage + 1);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onLimitChange(Number(e.target.value));
  };

  const pageButtons = [];
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);
  for (let p = startPage; p <= endPage; p++) {
    pageButtons.push(
      <button
        key={p}
        onClick={() => onPage(p)}
        disabled={isLoading}
        className={`px-3 py-1 rounded-md border ${
          p === currentPage
            ? "bg-liturgical-blue text-white"
            : "bg-white text-liturgical-blue hover:bg-liturgical-blue/10"
        }`}
      >
        {p}
      </button>,
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1 || isLoading}
          className="px-3 py-1 rounded-md border bg-white text-liturgical-blue hover:bg-liturgical-blue/10 disabled:opacity-50"
        >
          &lt; Previous
        </button>
        {pageButtons}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || isLoading}
          className="px-3 py-1 rounded-md border bg-white text-liturgical-blue hover:bg-liturgical-blue/10 disabled:opacity-50"
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
          className="px-2 py-1 border rounded"
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
