export interface User {
  id?: string;
  studentid: string;
  firstname: string;
  middlename: string;
  lastname: string;
  gender: string;
  baptismalname: string;
  phone: string;
  birthdate: Date | string;
  useremail: string;
  nationality: string;
  regionnumber: string;
  mothertongue: string;
  zonename: string;
  disabled: boolean;
  universityusers?: UniversityUser;
}

export interface UniversityUser {
  id?: string;
  departmentname: string;
  sponsorshiptype: string;
  participation: string;
  batch: string;
  confessionfather: string | null;
  advisors: string;
  role: string;
  mealcard: string | null;
  cafeteriaaccess: boolean;
}

export interface Admin {
  id?: string;
  studentId: string;
  adminUsername: string;
  adminPassword?: string;
  isSuperAdmin?: boolean;
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
export interface AuthPayload{
  admin: Admin;
  token: string;
}