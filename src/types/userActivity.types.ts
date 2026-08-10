export interface ActiveUserTodayType {
  id: number;
  name: string;
  email: string;

  role:
    | "student"
    | "client"
    | "admin";

  last_activity_at: string;
  last_login_at?: string | null;
}

export interface ActiveUsersTodayResponse {
  total: number;
  users: ActiveUserTodayType[];
}