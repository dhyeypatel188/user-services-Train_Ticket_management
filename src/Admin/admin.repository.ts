import { query } from "../config/database";
import { IUser, UserRole } from "../Interface/user.interface";

export class AdminRepository {
  private tableName = "users";

  // constructor() {
  //   this.createTable().catch(console.error);
  // }

  async createTable(): Promise<void> {
    try {
      await query(`
        CREATE TABLE IF NOT EXISTS ${this.tableName} (
          user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(50) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(20) DEFAULT 'user',
          access_token TEXT,
          refresh_token TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log(`Table ${this.tableName} created or already exists`);
    } catch (error) {
      console.error(`Error creating table ${this.tableName}:`, error);
    }
  }

  async createAdmin(
    name: string,
    email: string,
    passwordHash: string
  ): Promise<IUser> {
    const result = await query(
      `INSERT INTO users (name, email, password, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING user_id, name, email, role, created_at`,
      [name, email, passwordHash, UserRole.ADMIN]
    );
    return result.rows[0];
  }

  async findAdminByEmail(email: string): Promise<IUser | null> {
    const result = await query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0] || null;
  }

  async findUserById(user_id: string) {
    const result = await query("SELECT * FROM users WHERE id = $1", [user_id]);
    return result.rows[0] || null;
  }
}
