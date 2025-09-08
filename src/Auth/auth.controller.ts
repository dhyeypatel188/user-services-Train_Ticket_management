import { Request, Response } from "express";
import { AuthService } from "./auth.services";
import { LoginDto, RefreshTokenDto } from "./auth.dto";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { CustomException } from "../exception/custom.exception";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async login(req: Request, res: Response) {
    try {
      const loginDto = plainToInstance(LoginDto, req.body);
      await validateOrReject(loginDto);

      const response = await this.authService.login(loginDto);
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof CustomException) {
        res
          .status(error.response.responseStatusList.statusList[0].statusCode)
          .json(error.response);
      } else {
        console.log(error);
        const customError = new CustomException(
          400,
          "Validation failed",
          error
        );
        res.status(400).json(customError.response);
      }
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new CustomException(
          401,
          "Authorization header missing or invalid"
        );
      }
      const accesstoken = authHeader.split(" ")[1];
      const response = await this.authService.logout(accesstoken);
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof CustomException) {
        res
          .status(error.response.responseStatusList.statusList[0].statusCode)
          .json(error.response);
      } else {
        console.log(error);
        const customError = new CustomException(500, "Logout failed", error);
        res.status(500).json(customError.response);
      }
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const refreshTokenDto = plainToInstance(RefreshTokenDto, req.body);
      await validateOrReject(refreshTokenDto);

      const response = await this.authService.refreshToken(refreshTokenDto);
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof CustomException) {
        res
          .status(error.response.responseStatusList.statusList[0].statusCode)
          .json(error.response);
      } else {
        const customError = new CustomException(
          400,
          "Token refresh failed",
          error
        );
        res.status(400).json(customError.response);
      }
    }
  }
}
