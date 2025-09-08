export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export interface IUser {
  user_id?: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  created_at?: Date;
  updated_at?: Date;
}
