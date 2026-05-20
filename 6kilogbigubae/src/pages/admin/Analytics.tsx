import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend,
} from "recharts";
import { Users, UserCheck, Layers, ChevronDown, ChevronUp, BarChart2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import { useEffect, useRef, useState } from "react";
import { fetchAnalytics, BreakdownItem } from "../../features/users/userSlice";

const COLORS = [
  "#2563EB", "#16A34A", "#DC2626", "#D97706",
  "#7C3AED", "#0891B2", "#DB2777", "#65A30D",
  "#EA580C", "#0F766E", "#9333EA", "#B45309",
];

const CRITERIA_OPTIONS = [
  { key: "gender",          label: "Gender" },
  { key: "batch",           label: "Batch" },
  { key: "departmentname",  label: "Department" },
  { key: "participation",   label: "Participation Section" },
  { key: "sponsorshiptype", label: "Sponsorship Type" },
  { key: "clergicalstatus", label: "Clergy Status" },
  { key: "activitylevel",   label: "Activity Level" },
  { key: "advisors",        label: "Has Advisor" },
  { key: "cafeteriaaccess", label: "Cafeteria Access" },
  { key: "tookcourse",      label: "Took Course" },
];

const renderPieLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent,
}: {
  cx: number; cy: number; midAngle: number;
  innerRadius: number; outerRadius: number; percent: number;
}) => {
  if (percent < 0.04) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload, total }: {
  active?: boolean;
  payload?: { payload: BreakdownItem }[];
  total: number;
}) => {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  const pct = total > 0 ? ((item.count / total) * 100).toFixed(1) : "0.0";
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-sm">
      <p className="font-semibold text-gray-800">{item.name}</p>
      <p className="text-gray-600">{item.count} students</p>
      <p className="text-gray-500">{pct}% of total</p>
    </div>
  );
};

const CustomXTick = ({ x, y, payload }: { x?: number; y?: number; payload?: { value: string } }) => {
  const words = (payload?.value ?? "").split(" ");
  return (
    <g transform={`translate(${x},${y})`}>
      {words.map((word, i) => (
        <text key={i} x={0} y={0} dy={14 + i * 12} textAnchor="middle" fill="#6b7280" fontSize={10}>
          {word}
        </text>
      ))}
    </g>
  );
};

const CriteriaChart = ({
  label, data, total, showAsPie, isSingle,
}: {
  label: string; data: BreakdownItem[]; total: number; showAsPie: boolean; isSingle: boolean;
}) => {
  const [showOthers, setShowOthers] = useState(false);
  const othersItem = data.find((d) => d.originalName === "__others__");
  const mainData = data.filter((d) => d.originalName !== "__others__");

  return (
    <motion.div
      className={`bg-white rounded-lg shadow-md p-6 ${isSingle ? "lg:col-span-2 max-w-xl mx-auto w-full" : ""}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-base font-semibold mb-4 text-gray-800">
        Breakdown by <span className="text-liturgical-blue">{label}</span>
      </h3>

      <div className="overflow-x-auto">
        <div style={showAsPie
          ? { height: 280, minWidth: "100%" }
          : { width: Math.max(100, data.length * 80), height: 384, minWidth: "100%" }
        }>
        <ResponsiveContainer width="100%" height="100%">
          {showAsPie ? (
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={110}
                labelLine={false}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip total={total} />} />
            </PieChart>
          ) : (
            <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 10 }}>
              <XAxis dataKey="name" interval={0} tick={<CustomXTick />} height={60} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip total={total} />} />
              <Bar dataKey="count" name="Students" radius={[4, 4, 0, 0]} barSize={data.length <= 5 ? 48 : data.length <= 8 ? 32 : undefined}>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
        </div>
      </div>

      {showAsPie && (
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
          {data.map((item, i) => (
            <div key={item.originalName} className="flex items-center gap-1.5 text-xs text-gray-600">
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              {item.name}
            </div>
          ))}
        </div>
      )}

      {othersItem?.others && (
        <div className="mt-3">
          <button
            onClick={() => setShowOthers((v) => !v)}
            className="inline-flex items-center gap-1 text-xs text-liturgical-blue hover:underline"
          >
            {showOthers ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            {showOthers ? "Hide others" : "Show others"}
          </button>
          {showOthers && (
            <div className="mt-2 grid grid-cols-2 gap-1">
              {othersItem.others.map((o) => (
                <div key={o.name} className="flex justify-between text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                  <span className="truncate mr-2">{o.name}</span>
                  <span className="font-medium shrink-0">{o.count} ({o.percentage}%)</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-4 border-t border-gray-200 pt-4 divide-y divide-gray-100">
        {mainData.map((item, i) => (
          <div key={item.originalName} className="flex justify-between items-center py-1.5 text-xs text-gray-700">
            <span className="truncate mr-2 font-medium" style={{ color: COLORS[i % COLORS.length] }}>{item.name}</span>
            <span className="shrink-0 text-gray-500">{item.count} ({item.percentage}%)</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const Analytics = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { analytics, loading } = useSelector((state: RootState) => state.user);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [selectedCriteria, setSelectedCriteria] = useState<string[]>([]);
  const [activeCriteria, setActiveCriteria] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [chartsLoading, setChartsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fetch base stats on mount
  useEffect(() => {
    if (isAuthenticated) dispatch(fetchAnalytics([]));
  }, [dispatch, isAuthenticated]);

  const handleGenerate = async () => {
    if (selectedCriteria.length === 0) return;
    setActiveCriteria([...selectedCriteria]);
    setChartsLoading(true);
    await dispatch(fetchAnalytics(selectedCriteria));
    setChartsLoading(false);
    setDropdownOpen(false);
  };

  const toggleCriteria = (key: string) => {
    setSelectedCriteria((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const total = analytics?.total ?? 0;
  const activeUsers = analytics?.activeUsers ?? 0;
  const participationRate = analytics?.participationRate?.toFixed(2) ?? "0.00";
  const breakdowns = analytics?.breakdowns ?? {};

  const showPie = activeCriteria.length === 1;
  const isSingle = activeCriteria.length === 1;
  // Only show "..." on initial load (no data yet), not during chart generation
  const statsLoading = loading && !analytics;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Analytics</h2>
        <p className="text-sm text-gray-500 mt-1">Choose criteria and generate charts</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { icon: <Users size={24} />,    color: "liturgical-blue", label: "Total Students",     value: statsLoading ? "..." : total },
          { icon: <UserCheck size={24} />, color: "green-500",       label: "Active Members",     value: statsLoading ? "..." : activeUsers },
          { icon: <Layers size={24} />,    color: "gold",            label: "Participation Rate", value: statsLoading ? "..." : `${participationRate}%` },
        ].map(({ icon, color, label, value }, i) => (
          <motion.div
            key={i}
            className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${color}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 font-medium text-sm">{label}</p>
                <h3 className="text-3xl font-bold mt-1">{value}</h3>
              </div>
              <div className={`bg-${color}/10 p-3 rounded-full text-${color}`}>{icon}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Breakdown By dropdown + Generate button */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Breakdown By</h3>

        <div className="flex flex-wrap items-center gap-3">
          {/* Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-liturgical-blue hover:text-liturgical-blue transition-all min-w-[200px] justify-between"
            >
              <span>
                {selectedCriteria.length === 0
                  ? "Select criteria..."
                  : `${selectedCriteria.length} selected`}
              </span>
              <ChevronDown size={15} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1">
                <div className="flex justify-end px-3 pt-2 pb-1">
                  <button
                    onClick={() => setDropdownOpen(false)}
                    className="text-xs text-liturgical-blue hover:underline"
                  >
                    Done
                  </button>
                </div>
                {CRITERIA_OPTIONS.map(({ key, label }) => {
                  const checked = selectedCriteria.includes(key);
                  return (
                    <button
                      key={key}
                      onClick={() => toggleCriteria(key)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        checked ? "bg-liturgical-blue border-liturgical-blue" : "border-gray-300"
                      }`}>
                        {checked && (
                          <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M1 6l3.5 3.5L11 2" />
                          </svg>
                        )}
                      </span>
                      {label}
                    </button>
                  );
                })}

                {selectedCriteria.length > 0 && (
                  <div className="border-t border-gray-100 mt-1 pt-1 px-3 pb-2">
                    <button
                      onClick={() => setSelectedCriteria([])}
                      className="text-xs text-red-400 hover:text-red-600"
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected tags */}
          <div className="flex flex-wrap gap-2">
            {selectedCriteria.map((key) => {
              const label = CRITERIA_OPTIONS.find((c) => c.key === key)?.label ?? key;
              return (
                <span key={key} className="inline-flex items-center gap-1 px-2.5 py-1 bg-liturgical-blue/10 text-liturgical-blue text-xs rounded-full font-medium">
                  {label}
                  <button onClick={() => toggleCriteria(key)} className="hover:text-red-500 ml-0.5">✕</button>
                </span>
              );
            })}
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={selectedCriteria.length === 0}
            className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 bg-liturgical-blue text-white text-sm font-semibold rounded-lg hover:bg-liturgical-blue/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <BarChart2 size={16} />
            Generate Charts
          </button>
        </div>

        {activeCriteria.length > 0 && (
          <p className="text-xs text-gray-400 mt-3">
            {activeCriteria.length === 1
              ? "Showing pie chart — select 2+ criteria for bar charts"
              : `Showing ${activeCriteria.length} bar charts`}
          </p>
        )}
      </div>

      {/* Charts */}
      {activeCriteria.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-300">
          <BarChart2 size={48} className="mb-3" />
          <p className="text-sm">No charts generated yet</p>
          <p className="text-xs mt-1">Select criteria above and click Generate Charts</p>
        </div>
      )}

      {!chartsLoading && activeCriteria.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeCriteria.map((key) => {
            const data = breakdowns[key];
            if (!data || data.length === 0) return null;
            const label = CRITERIA_OPTIONS.find((c) => c.key === key)?.label ?? key;
            return (
              <CriteriaChart
                key={key}
                label={label}
                data={data}
                total={total}
                showAsPie={showPie}
                isSingle={isSingle}
              />
            );
          })}
        </div>
      )}

      {chartsLoading && activeCriteria.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeCriteria.map((key) => (
            <div key={key} className="bg-white rounded-lg shadow-md p-6 h-80 animate-pulse" />
          ))}
        </div>
      )}
    </div>
  );
};

export default Analytics;
