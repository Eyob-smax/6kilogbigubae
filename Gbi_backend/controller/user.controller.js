import { createPrismaClient } from "../models/DatabaseConfig.js";
import { asyncHandler } from "../utils/util.js";
import { JoiValidator } from "../utils/util.js";

const schema = JoiValidator();
const prisma = createPrismaClient().client;

const isOwner = (adminStudentId, userCreatedBy) =>
  !!adminStudentId && !!userCreatedBy && adminStudentId === userCreatedBy;

const canEditUser = (admin, user) => {
  if (admin?.isSuperAdmin || admin?.editAnyUser) return true;
  if (admin?.editSpecificUsers || admin?.registerUsers) {
    return isOwner(admin.studentid, user.createdBy);
  }
  return false;
};

const canDeleteUser = (admin, user) => {
  if (admin?.isSuperAdmin || admin?.removeAnyUsers) return true;
  if (admin?.removeSpecificUsers || admin?.registerUsers) {
    return isOwner(admin.studentid, user.createdBy);
  }
  return false;
};

// Thuiss is for Helper to check invalid studentid format
const validateStudentIdFormat = (id, res) => {
  if (id.includes("/")) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid Student ID format. Use hyphen (-) instead of slash (/).",
    });
  }
  return null;
};

const addUser = asyncHandler(async (req, res) => {
  if (!req.admin?.isSuperAdmin && !req.admin?.registerUsers) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to register users",
    });
  }

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  const validationError = validateStudentIdFormat(value.studentid, res);
  if (validationError) return validationError;

  const existingUser = await prisma.user.findUnique({
    where: { studentid: value.studentid },
  });
  if (existingUser) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists!" });
  }

  const data = value;
  const participation = data.universityusers.participation;

  const user = await prisma.user.create({
    data: {
      ...data,
      createdBy: req.admin?.studentid ?? null,
      birthdate: new Date(data.birthdate),
      universityusers: {
        create: {
          ...data.universityusers,
          role: participation === "None" ? "None" : data.universityusers.role,
          batch: Number(data.universityusers.batch),
        },
      },
    },
    include: { universityusers: true },
  });

  res.status(201).json({
    success: true,
    user: {
      ...user,
      birthdate: user.birthdate.toISOString(),
    },
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const studentId = req.params?.id;
  if (!studentId) {
    return res
      .status(400)
      .json({ success: false, message: "Student ID is required" });
  }

  const validationError = validateStudentIdFormat(studentId, res);
  if (validationError) return validationError;

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  const existingUser = await prisma.user.findUnique({
    where: { studentid: studentId },
    include: { universityusers: true },
  });

  if (!existingUser) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  if (!canEditUser(req.admin, existingUser)) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to edit this user",
    });
  }

  const participation = value.universityusers.participation;

  const updatedUser = await prisma.user.update({
    where: { studentid: studentId },
    data: {
      ...value,
      birthdate: new Date(value.birthdate),
      universityusers: {
        update: {
          where: { userid: existingUser.userid }, // Fixed: use existing userid
          data: {
            ...value.universityusers,
            batch: Number(value.universityusers.batch),
            role:
              participation === "None" ? "None" : value.universityusers.role,
            confessionfather:
              value.universityusers.confessionfather ??
              existingUser.universityusers.confessionfather,
            mealcard:
              value.universityusers.mealcard ??
              existingUser.universityusers.mealcard,
            emergencyname:
              value.universityusers.emergencyname ??
              existingUser.universityusers.emergencyname,
            emergencyphone:
              value.universityusers.emergencyphone ??
              existingUser.universityusers.emergencyphone,
            cafeterianame:
              value.universityusers.cafeterianame ??
              existingUser.universityusers.cafeterianame,
          },
        },
      },
    },
    include: { universityusers: true },
  });

  res.json({
    success: true,
    updatedUser: {
      ...updatedUser,
      birthdate: updatedUser.birthdate.toISOString(),
    },
  });
});
// after this i refactor some of the codes for pagination fetch from the server
const getUsers = asyncHandler(async (req, res) => {
  // pagination parameters: page and limit (defaults)
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const offset = (page - 1) * limit;

  const where = {};

  if (!req.admin?.isSuperAdmin && !req.admin?.readUsers) {
    if (req.admin?.registerUsers) {
      where.createdBy = req.admin.studentid;
    } else {
      return res.status(200).json({
        success: true,
        users: [],
        pagination: {
          totalUsers: 0,
          totalPages: 0,
          currentPage: page,
          limit,
          hasNext: false,
          hasPrev: false,
        },
      });
    }
  }

  // count total users so frontend can calculate pages
  const totalUsers = await prisma.user.count({ where });

  const users = await prisma.user.findMany({
    where,
    orderBy: { userid: "desc" },
    skip: offset,
    take: limit,
    include: { universityusers: true },
  });

  const formatted = users.map((u) => ({
    ...u,
    birthdate: u.birthdate.toISOString(),
  }));

  const totalPages = limit > 0 ? Math.ceil(totalUsers / limit) : 1;
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  res.status(200).json({
    success: true,
    users: formatted,
    pagination: {
      totalUsers,
      totalPages,
      currentPage: page,
      limit,
      hasNext,
      hasPrev,
      nextUrl: hasNext ? `/user?page=${page + 1}&limit=${limit}` : undefined,
      prevUrl: hasPrev ? `/user?page=${page - 1}&limit=${limit}` : undefined,
    },
  });
});

const getUser = asyncHandler(async (req, res) => {
  const studentId = req.params.id;
  if (!studentId) {
    return res
      .status(400)
      .json({ success: false, message: "Student ID is required" });
  }

  const validationError = validateStudentIdFormat(studentId, res);
  if (validationError) return validationError;

  const user = await prisma.user.findUnique({
    where: { studentid: studentId },
    include: { universityusers: true },
  });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  if (
    !req.admin?.isSuperAdmin &&
    !req.admin?.readUsers &&
    !isOwner(req.admin?.studentid, user.createdBy)
  ) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to view this user",
    });
  }

  res.json({
    success: true,
    user: {
      ...user,
      birthdate: user.birthdate.toISOString(),
    },
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const studentId = req.params.id;
  if (!studentId) {
    return res
      .status(400)
      .json({ success: false, message: "Student ID is required" });
  }

  const validationError = validateStudentIdFormat(studentId, res);
  if (validationError) return validationError;

  const userExists = await prisma.user.findUnique({
    where: { studentid: studentId },
  });

  if (!userExists) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  if (!canDeleteUser(req.admin, userExists)) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to delete this user",
    });
  }

  await prisma.user.delete({
    where: { studentid: studentId },
  });

  res.status(200).json({ success: true, message: "User deleted successfully" });
});

const deleteAllUsers = asyncHandler(async (req, res) => {
  const count = await prisma.user.count();
  if (count === 0) {
    return res.status(404).json({ success: false, message: "No users found" });
  }

  await prisma.user.deleteMany({});
  res
    .status(200)
    .json({ success: true, message: "All users deleted successfully" });
});

// Criteria that live on the User model directly
const USER_CRITERIA = new Set(["gender", "clergicalstatus"]);

// Criteria that live on universityusers
const UNI_CRITERIA = new Set([
  "batch", "departmentname", "participation",
  "sponsorshiptype", "activitylevel", "advisors",
  "cafeteriaaccess", "tookcourse",
]);

// All valid criteria
const ALL_CRITERIA = new Set([...USER_CRITERIA, ...UNI_CRITERIA]);

// Build top-5 + others breakdown from a flat count map
const buildTopBreakdown = (countMap, total, limit = 5) => {
  const sorted = Object.entries(countMap).sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, limit);
  const rest = sorted.slice(limit);
  const othersCount = rest.reduce((sum, [, v]) => sum + v, 0);
  const result = top.map(([name, count]) => ({
    name: String(name).replace(/_/g, " "),
    count,
    percentage: total === 0 ? 0 : Number(((count / total) * 100).toFixed(1)),
    originalName: name,
  }));
  if (othersCount > 0) {
    result.push({
      name: "Others",
      count: othersCount,
      percentage: total === 0 ? 0 : Number(((othersCount / total) * 100).toFixed(1)),
      originalName: "__others__",
      others: rest.map(([name, count]) => ({
        name: String(name).replace(/_/g, " "),
        count,
        percentage: total === 0 ? 0 : Number(((count / total) * 100).toFixed(1)),
      })),
    });
  }
  return result;
};

// Criteria with few fixed values — show all, no top-5 limiting
const FEW_VALUE_CRITERIA = new Set([
  "gender", "clergicalstatus", "sponsorshiptype",
  "activitylevel", "advisors", "cafeteriaaccess", "tookcourse",
]);

const getAnalytics = asyncHandler(async (req, res) => {
  const breakdownParam = req.query.breakdown || "";
  const requestedCriteria = breakdownParam
    ? breakdownParam.split(",").map((s) => s.trim()).filter((s) => ALL_CRITERIA.has(s))
    : [];

  const total = await prisma.user.count();

  // Always return base stats
  const allRecords = await prisma.user.findMany({
    select: {
      gender: true,
      clergicalstatus: true,
      universityusers: {
        select: {
          participation: true,
          role: true,
          activitylevel: true,
          batch: true,
          departmentname: true,
          sponsorshiptype: true,
          advisors: true,
          cafeteriaaccess: true,
          tookcourse: true,
        },
      },
    },
  });

  let participatingCount = 0;
  let activeCount = 0;

  allRecords.forEach((r) => {
    const u = r.universityusers || {};
    if ((u.participation ?? "None") !== "None") participatingCount += 1;
    if ((u.role ?? "None") !== "None") activeCount += 1;
  });

  const participationRate =
    total === 0 ? 0 : Number(((participatingCount / total) * 100).toFixed(2));

  // Build per-criteria breakdowns
  const breakdowns = {};

  for (const criteria of requestedCriteria) {
    const countMap = {};

    allRecords.forEach((r) => {
      let val;
      if (USER_CRITERIA.has(criteria)) {
        val = r[criteria] ?? "Unknown";
      } else {
        const u = r.universityusers || {};
        val = u[criteria];
        if (val === null || val === undefined) val = "Unknown";
        // Convert booleans to readable labels
        if (typeof val === "boolean") val = val ? "Yes" : "No";
      }
      countMap[val] = (countMap[val] || 0) + 1;
    });

    const limit = FEW_VALUE_CRITERIA.has(criteria) ? Infinity : 5;
    breakdowns[criteria] = buildTopBreakdown(countMap, total, limit);
  }

  res.status(200).json({
    success: true,
    analytics: {
      total,
      activeUsers: activeCount,
      participating: participatingCount,
      participationRate,
      breakdowns,
    },
  });
});

export {
  getUser,
  updateUser,
  getUsers,
  addUser,
  deleteUser,
  deleteAllUsers,
  getAnalytics,
};
