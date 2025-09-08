import { Request, Response } from "express";
import { ResponseUtil } from "../utils/response.utils";
import { CustomException } from "../exception/custom.exception";
import { UserService } from "./user.services";
import { CreateUserDto } from "./user.dto";
import { plainToInstance } from "class-transformer";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async create(req: Request, res: Response) {
    try {
      console.log(req.body);
      const dto = plainToInstance(CreateUserDto, req.body, {
        enableImplicitConversion: true,
      });

      const admin = await this.userService.createUser(dto);
      const response = ResponseUtil.success(
        admin,
        "Sign up Successfully"
      );
      res.status(201).json(response);
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

  async deleteUser(req: Request, res: Response) {
    try {
      const { user_id } = req.params;
      if (!user_id || isNaN(Number(user_id))) {
        throw new CustomException(400, "Invalid user ID");
      }
      const user = await this.userService.deleteUser(user_id);
      const response = ResponseUtil.success(user, "Admin deleted successfully");
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof CustomException) {
        res
          .status(error.response.responseStatusList.statusList[0].statusCode)
          .json(error.response);
      } else {
        const customError = new CustomException(
          400,
          "Validation failed",
          error
        );
        res.status(400).json(customError.response);
      }
    }
  }
}
