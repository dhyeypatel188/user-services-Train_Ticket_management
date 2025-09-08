import { query } from "../config/database";
import { ITokens } from "../Interface/auth.interface";

export class AuthRepository {
  async saveRefreshToken(
    userId: string,
    refresh_token: string,
    access_token: string
  ): Promise<void> {
    await query(
      "UPDATE users SET refresh_token= $2, access_token = $3 WHERE user_id = $1",
      [userId, refresh_token, access_token]
    );
  }

  async invalidateRefreshToken(id: string): Promise<void> {
    await query(
      "UPDATE users SET refresh_token = null, access_token = null WHERE user_id = $1",
      [id]
    );
  }

  async findValidRefreshToken(token: string): Promise<boolean> {
    const result = await query(
      "SELECT 1 FROM user_tokens WHERE refresh_token = $1 AND is_invalidated = false AND expires_at > NOW()",
      [token]
    );
    return result.rowCount! > 0;
  }
}
