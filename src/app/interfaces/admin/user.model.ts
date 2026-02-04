import { UserRole } from "./role.type";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;

  created_at?: string;
  updated_at?: string;
}
