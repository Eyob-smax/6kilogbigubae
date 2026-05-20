import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export const EXPORTABLE_COLUMNS = [
  { id: "studentid", label: "Student ID" },
  { id: "fullname", label: "Full Name" },
  { id: "phone", label: "Phone" },
  { id: "gender", label: "Gender" },
  { id: "clergicalstatus", label: "Clerical Status" },
  { id: "departmentname", label: "Department" },
  { id: "batch", label: "Batch" },
  { id: "sponsorshiptype", label: "Sponsorship" },
  { id: "participation", label: "Participation" },
  { id: "cafeteriaaccess", label: "Cafeteria Access" },
  { id: "tookcourse", label: "Took Course" },
  { id: "activitylevel", label: "Activity Level" },
];

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: (columns: string[], format: "PDF" | "DOC", title: string) => void;
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onNext,
}) => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    EXPORTABLE_COLUMNS.map((c) => c.id)
  );
  const [format, setFormat] = useState<"PDF" | "DOC">("PDF");
  const [documentTitle, setDocumentTitle] = useState("6Kilo GbiGubae Students Data Report");

  useEffect(() => {
    if (isOpen) {
      setSelectedColumns(EXPORTABLE_COLUMNS.map((c) => c.id));
      setFormat("PDF");
      setDocumentTitle("6Kilo GbiGubae Students Data Report");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleColumn = (id: string) => {
    setSelectedColumns((prev) =>
      prev.includes(id) ? prev.filter((colId) => colId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (selectAll: boolean) => {
    if (selectAll) {
      setSelectedColumns(EXPORTABLE_COLUMNS.map((c) => c.id));
    } else {
      setSelectedColumns([]);
    }
  };

  const handleNext = () => {
    if (selectedColumns.length === 0) {
      alert("Please select at least one column to export.");
      return;
    }
    if (!documentTitle.trim()) {
      alert("Please enter a document title.");
      return;
    }
    onNext(selectedColumns, format, documentTitle);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden transform transition-all duration-300">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Export Data</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-2 border-b pb-1">
              1. Document Title
            </h4>
            <input
              type="text"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder="Enter document title"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-3 border-b pb-1">
              2. Select Format
            </h4>
            <div className="flex space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="PDF"
                  checked={format === "PDF"}
                  onChange={() => setFormat("PDF")}
                  className="form-radio text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span className="text-gray-700">PDF Document</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="DOC"
                  checked={format === "DOC"}
                  onChange={() => setFormat("DOC")}
                  className="form-radio text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span className="text-gray-700">Word Document (DOC)</span>
              </label>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3 border-b pb-1">
              <h4 className="font-medium text-gray-700">3. Select Columns</h4>
              <button
                type="button"
                onClick={() =>
                  handleSelectAll(
                    selectedColumns.length !== EXPORTABLE_COLUMNS.length
                  )
                }
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                {selectedColumns.length === EXPORTABLE_COLUMNS.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {EXPORTABLE_COLUMNS.map((column) => (
                <label
                  key={column.id}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded border border-transparent hover:border-gray-200 transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedColumns.includes(column.id)}
                    onChange={() => handleToggleColumn(column.id)}
                    className="form-checkbox text-indigo-600 rounded focus:ring-indigo-500 w-4 h-4"
                  />
                  <span className="text-gray-700 text-sm">{column.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end space-x-3 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={selectedColumns.length === 0}
            className={`px-6 py-2 rounded-md text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              selectedColumns.length === 0
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 shadow-sm"
            }`}
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
