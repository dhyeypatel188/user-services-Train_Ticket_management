import { query } from "../config/database";
import { IUser, UserRole } from "../Interface/user.interface";

export class UserRepository {
  private tableName = "users";

  async createUser(
    name: string,
    email: string,
    passwordHash: string
  ): Promise<IUser> {
    const result = await query(
      `INSERT INTO users (name, email, password, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING user_id, name, email, role, created_at`,
      [name, email, passwordHash, UserRole.USER]
    );
    return result.rows[0];
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    const result = await query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0] || null;
  }

  async findUserById(user_id: string) {
    const result = await query("SELECT * FROM users WHERE user_id = $1", [user_id]);
    return result.rows[0] || null;
  }

  async deleteUser(user_id: string) {
    const result = await query("DELETE FROM users WHERE user_id = $1", [user_id]);
    return result.rows[0] || null;
  }
}
