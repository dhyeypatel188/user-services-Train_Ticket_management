import { Request, Response } from "express";
import { AdminService } from "../Admin/admin.services";
import { CreateAdminDto } from "../Admin/admin.dto";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { ResponseUtil } from "../utils/response.utils";
import { CustomException } from "../exception/custom.exception";

export class AdminController {
  private readonly adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  async create(req: Request, res: Response) {
    try {
      const dto = plainToInstance(CreateAdminDto, req.body);
      await validateOrReject(dto);

      const admin = await this.adminService.createAdmin(dto);
      const response = ResponseUtil.success(
        admin,
        "Admin created successfully"
      );
      res.status(201).json(response);
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
