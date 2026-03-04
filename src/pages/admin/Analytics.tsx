import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Users, UserCheck, Layers } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import { useEffect } from "react";
import { fetchUsers } from "../../features/users/userSlice";

const COLORS = ["#1A237E", "#5C6BC0", "#9FA8DA", "#C5CAE9"];

const Analytics = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch<AppDispatch>();
  const { users, pagination, loading } = useSelector(
    (state: RootState) => state.user,
  );
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // fetch when the admin is logged in; avoids running before token is set
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUsers({ page: 1, limit: 1000 }));
    }
  }, [dispatch, isAuthenticated]);

  const totalUsers = pagination?.totalUsers ?? users.length;
  const activeUsersCount = users.filter(
    (u) =>
      u.universityusers?.activitylevel === "Active" ||
      u.universityusers?.activitylevel === "Very_Active",
  ).length;
  const participationRate = totalUsers
    ? ((activeUsersCount / totalUsers) * 100).toFixed(2)
    : "0.00";

  const participationData = [
    { name: t("admin.analytics.active"), value: activeUsersCount },
    { name: t("admin.analytics.total"), value: totalUsers - activeUsersCount },
  ];

  const groupDistMap: Record<string, number> = {};
  users.forEach((u) => {
    const dept = u.universityusers?.departmentname || "Unknown";
    groupDistMap[dept] = (groupDistMap[dept] || 0) + 1;
  });
  const groupDistributionData = Object.entries(groupDistMap).map(
    ([name, value]) => ({ name, value }),
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{t("admin.analytics.title")}</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          {
            icon: <Users size={24} />,
            color: "liturgical-blue",
            label: t("admin.analytics.total"),
            value: totalUsers,
          },
          {
            icon: <UserCheck size={24} />,
            color: "green-500",
            label: t("admin.analytics.active"),
            value: activeUsersCount,
          },
          {
            icon: <Layers size={24} />,
            color: "gold",
            label: t("admin.analytics.distribution"),
            value: participationRate,
          },
        ].map(({ icon, color, label, value }, index) => (
          <motion.div
            key={index}
            className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${color}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 font-medium">{label}</p>
                <h3 className="text-3xl font-bold mt-1">{value}</h3>
              </div>
              <div className={`bg-${color}/10 p-3 rounded-full text-${color}`}>
                {icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {participationData.length > 0 && (
          <motion.div
            className="bg-white rounded-lg shadow-md p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4">
              {t("admin.analytics.participation")}
            </h3>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={participationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {participationData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {groupDistributionData.length > 0 && (
          <motion.div
            className="bg-white rounded-lg shadow-md p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold mb-4">
              {t("admin.analytics.distribution")}
            </h3>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={groupDistributionData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Users" fill="#1A237E" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
