import bcrypt from "bcrypt";
import { AdminRepository } from "../Admin/admin.repository";
import { AuthRepository } from "./auth.repository";
import { TokenUtil } from "../utils/token.utils";
import { LoginDto, RefreshTokenDto } from "./auth.dto";
import { IAuthResponse, ITokens } from "../Interface/auth.interface";
import { CustomException } from "../exception/custom.exception";
import { IResponse } from "../Interface/response.inerfaces";
import { ResponseUtil } from "../utils/response.utils";

export class AuthService {
  private adminRepo: AdminRepository;
  private authRepo: AuthRepository;

  constructor() {
    this.adminRepo = new AdminRepository();
    this.authRepo = new AuthRepository();
  }

  async login(loginDto: LoginDto): Promise<IResponse<IAuthResponse>> {
    const user = await this.adminRepo.findAdminByEmail(loginDto.email);

    if (!user) {
      throw new CustomException(401, "Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new CustomException(401, "Invalid credentials");
    }

    const accessToken = TokenUtil.generateAccessToken(user);
    const refreshToken = TokenUtil.generateRefreshToken(user);

    await this.authRepo.saveRefreshToken(user.user_id!, refreshToken, accessToken);

    const responseData: any = {
      id: user.user_id!.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      accessToken,
      refreshToken,
    };

    return ResponseUtil.success(responseData, "Login successful");
  }

  async logout(access_token: string): Promise<IResponse<null>> {
    const payload = TokenUtil.verifyAccessToken(access_token);

    // Get user ID from the token payload
    const userId = payload.userId;
    console.log(userId);
    await this.authRepo.invalidateRefreshToken(userId);
    return ResponseUtil.success(null, "Logout successful");
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto
  ): Promise<IResponse<ITokens>> {
    try {
      const payload = TokenUtil.verifyRefreshToken(
        refreshTokenDto.refreshToken
      );
      const isValid = await this.authRepo.findValidRefreshToken(
        refreshTokenDto.refreshToken
      );

      if (!isValid) {
        throw new CustomException(401, "Invalid refresh token");
      }

      const admin = await this.adminRepo.findUserById(payload.userId);
      if (!admin) {
        throw new CustomException(401, "User not found");
      }

      const newAccessToken = TokenUtil.generateAccessToken(admin);
      const newRefreshToken = TokenUtil.generateRefreshToken(admin);

      // Invalidate old refresh token
      //   await this.authRepo.invalidateRefreshToken(refreshTokenDto.refreshToken);
      // Save new refresh token
      await this.authRepo.saveRefreshToken(
        admin.id,
        newRefreshToken,
        newAccessToken
      );

      return ResponseUtil.success(
        {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
        "Token refreshed successfully"
      );
    } catch (error) {
      throw new CustomException(401, "Invalid refresh token");
    }
  }
}
