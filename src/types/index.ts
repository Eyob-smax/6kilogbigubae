type TParticipationType =
  | "Gbi_Gubaye_Secretariat"
  | "Audit_and_Inspection_Section"
  | "Education_and_Apostolic_Service_Section"
  | "Accounting_and_Assets_Section"
  | "Development_and_Income_Collection_Section"
  | "Hymns_and_Arts_Section"
  | "Planning_Monitoring_Reports_and_Information_Management_Section"
  | "Professional_and_Community_Development_Section"
  | "Batch_and_Programs_Coordination_Section"
  | "Member_Care_Advice_and_Capacity_Building_Section"
  | "None";

type TMotherTongue =
  | "Amharic"
  | "Oromifa"
  | "Tigrigna"
  | "Not_Specified"
  | "English"
  | "Other";
type TImparment =
  | "Physical"
  | "None"
  | "Psychosocial"
  | "Visual"
  | "Hearing"
  | "Other"
  | "Intellectual";
type TRoleType =
  | "Member"
  | "ClassSecretary"
  | "ClassTeamLead"
  | "ClassManager"
  | "None"
  | "SubclassSecretary"
  | "SubclassManager"
  | "SubclassTeamLead";

type TAdvisorType = "Yes" | "No";

type TRegionType =
  | "Addis_Ababa"
  | "Dire_Dawa"
  | "Tigray"
  | "Afar"
  | "Amhara"
  | "Oromia"
  | "Somali"
  | "Benishangul_Gumuz"
  | "SNNPR"
  | "Sidama"
  | "South_West_Ethiopia_Peoples_Region"
  | "Central_Ethiopia_Region"
  | "South_Ethiopia_Region"
  | "Harari"
  | "Not_Specified";
export interface User {
  userid?: string;
  studentid: string;
  createdBy?: string | null;
  firstname: string;
  middlename: string;
  lastname: string;
  telegram_username: string;
  gender: "Male" | "Female";
  baptismalname: string;
  phone: string;
  birthdate: Date | string;
  useremail?: string | null;
  nationality: string;
  region: TRegionType;
  mothertongue: TMotherTongue;
  zonename: string;
  isphysicallydisabled: TImparment;
  clergicalstatus?: "Deacon" | "Priest" | "None";
  universityusers?: UniversityUser;
}

export interface UniversityUser {
  userid?: string;
  departmentname: string;
  sponsorshiptype: "Government" | "Self_Sponsored" | "Scholarship";
  participation: TParticipationType;
  batch: number;
  confessionfather: string | null;
  advisors: TAdvisorType;
  role: TRoleType;
  mealcard?: string | null;
  cafeteriaaccess: boolean;
  cafeterianame?: string | null;
  holidayincampus: boolean;
  tookcourse: boolean;
  activitylevel: "Very_Active" | "Active" | "Less_Active" | "Not_Active";
}

export interface Admin {
  userid?: string;
  studentid: string;
  adminusername: string;
  adminpassword?: string;
  isSuperAdmin?: boolean;
  role?: "Super Admin" | "Admin";
  usersCreatedCount?: number;
  createdAt?: string;
  permissions: Permissions;
}

export interface GetAdminResponse {
  admins: Admin[];
}

export interface AuthContextType {
  isAuthenticated: boolean;
  admin: Admin | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export interface ChartData {
  name: string;
  value: number;
}
export interface AuthPayload {
  admin: Admin;
}

export interface Pagination {
  totalUsers: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextUrl?: string;
  prevUrl?: string;
}

export interface UsersApiResponse {
  success: boolean;
  users: User[];
  pagination: Pagination;
}

export interface Permissions {
  readUsers: boolean;
  registerUsers: boolean;
  editAnyUser: boolean;
  editSpecificUsers: boolean;
  removeAnyUsers: boolean;
  removeSpecificUsers: boolean;
}

export const DEFAULT_PERMISSIONS: Permissions = {
  readUsers: false,
  registerUsers: false,
  editAnyUser: false,
  editSpecificUsers: false,
  removeAnyUsers: false,
  removeSpecificUsers: false,
};

export const PERMISSION_META: {
  key: keyof Permissions;
  label: string;
  description: string;
}[] = [
  {
    key: "readUsers",
    label: "Read Users",
    description: "View user profiles and account details",
  },
  {
    key: "registerUsers",
    label: "Register Users",
    description: "Create new user accounts in the system",
  },
  {
    key: "editAnyUser",
    label: "Edit Any User",
    description: "Modify details for any user account",
  },
  {
    key: "editSpecificUsers",
    label: "Edit Only Specific Users",
    description: "Modify details for assigned users only",
  },
  {
    key: "removeAnyUsers",
    label: "Remove Any Users",
    description: "Delete any user account from the system",
  },
  {
    key: "removeSpecificUsers",
    label: "Remove Only Specific Users",
    description: "Delete only assigned user accounts",
  },
];
