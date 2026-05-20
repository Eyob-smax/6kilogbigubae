export interface UserFilters {
  gender: string | null;
  batch: number | null;
  departmentname: string | null;
  clergicalstatus: string | null;
  sponsorshiptype: string | null;
  cafeteriaaccess: boolean | null;
  tookcourse: boolean | null;
  participation: string | null;
}

export const DEFAULT_USER_FILTERS: UserFilters = {
  gender: null,
  batch: null,
  departmentname: null,
  clergicalstatus: null,
  sponsorshiptype: null,
  cafeteriaaccess: null,
  tookcourse: null,
  participation: null,
};
