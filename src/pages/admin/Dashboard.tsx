// import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Users, UserCog, BarChart2, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import LoadingScreen from "../../components/ui/LoadingScreen";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchUsers } from "../../features/users/userSlice";

let isFirstRender = true;

const Dashboard = () => {
  const { users, loading, error } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useDispatch<AppDispatch>();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.5,
      },
    }),
  };

  useEffect(() => {
    if (isFirstRender) {
      isFirstRender = false;
      dispatch(fetchUsers());
      return;
    }
  }, [dispatch, users]);

  const totalUsers = users?.length;

  const activeUsers = users
    ?.map((user): number => {
      if (user.universityusers?.activitylevel === "Active") return 0.75;
      if (user.universityusers?.activitylevel === "Very_Active") return 1;
      if (user.universityusers?.activitylevel === "Less_Active") return 0.5;
      return 0;
    })
    .reduce((a, b) => a + b, 0);
  const participationRate = totalUsers
    ? ((activeUsers / totalUsers) * 100).toFixed(2)
    : "0.00";

  if (loading) return <LoadingScreen />;

  if (error) {
    (async () => {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: error,
      });
    })();
  }
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          className="bg-white rounded-lg shadow-md p-6 border-l-4 border-liturgical-blue"
          custom={0}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 font-medium">Total Users</p>
              <h3 className="text-3xl font-bold mt-1">{totalUsers}</h3>
            </div>
            <div className="bg-liturgical-blue/10 p-3 rounded-full text-liturgical-blue">
              <Users size={24} />
            </div>
          </div>
          <Link
            to="/admin/users"
            className="text-sm text-liturgical-blue mt-4 inline-block hover:underline"
          >
            View all users
          </Link>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow-md p-6 border-l-4 border-gold"
          custom={1}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 font-medium">Active Users</p>
              <h3 className="text-3xl font-bold mt-1">
                {users.filter(
                  (u) =>
                    u.universityusers?.activitylevel === "Active" ||
                    u.universityusers?.activitylevel === "Very_Active"
                ).length || 0}
              </h3>
            </div>
            <div className="bg-gold/10 p-3 rounded-full text-gold">
              <UserCog size={24} />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            {(
              (users.filter(
                (u) =>
                  u.universityusers?.activitylevel === "Active" ||
                  u.universityusers?.activitylevel === "Very_Active"
              ).length /
                totalUsers) *
              100
            )
              .toFixed(2)
              .toString() + "%"}{" "}
            of total users
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500"
          custom={2}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 font-medium">Participation Rate</p>
              <h3 className="text-3xl font-bold mt-1">{participationRate}</h3>
            </div>
            <div className="bg-green-500/10 p-3 rounded-full text-green-500">
              <BarChart2 size={24} />
            </div>
          </div>
          <Link
            to="/admin/analytics"
            className="text-sm text-green-500 mt-4 inline-block hover:underline"
          >
            View analytics
          </Link>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          className="bg-white rounded-lg shadow-md p-6"
          custom={3}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Calendar size={20} className="mr-2 text-liturgical-blue" />
            Next Event
          </h3>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow-md p-6"
          custom={4}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>

          <div className="space-y-3">
            <Link
              to="/admin/users"
              className="block w-full text-left px-4 py-3 rounded-md bg-liturgical-blue/5 hover:bg-liturgical-blue/10 transition-colors"
            >
              Manage Users
            </Link>

            <Link
              to="/admin/analytics"
              className="block w-full text-left px-4 py-3 rounded-md bg-liturgical-blue/5 hover:bg-liturgical-blue/10 transition-colors"
            >
              View Analytics
            </Link>

            <Link
              to="/"
              className="block w-full text-left px-4 py-3 rounded-md bg-liturgical-blue/5 hover:bg-liturgical-blue/10 transition-colors"
            >
              Visit Public Site
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
