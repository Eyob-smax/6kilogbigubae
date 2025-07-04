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
export interface User {
  userid?: string;
  studentid: string;
  firstname: string;
  middlename: string;
  lastname: string;
  gender: "Male" | "Female";
  baptismalname: string;
  phone: string;
  birthdate: Date | string;
  useremail: string;
  nationality: string;
  regionnumber: number;
  mothertongue: TMotherTongue;
  zonename: string;
  isphysicallydisabled: TImparment;
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
  mealcard?: string;
  cafeteriaaccess: boolean;
}

export interface Admin {
  userid?: string;
  studentid: string;
  adminusername: string;
  createdAt?: Date;
  isSuperAdmin?: boolean;
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
  token: string;
}
