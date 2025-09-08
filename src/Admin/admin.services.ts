import { AdminRepository } from "../Admin/admin.repository";
import { CreateAdminDto } from "../Admin/admin.dto";
import bcrypt from "bcrypt";
import { CustomException } from "../exception/custom.exception";

const SALT_ROUNDS = 10;

export class AdminService {
  private repo: AdminRepository;

  constructor() {
    this.repo = new AdminRepository();
  }

  async createAdmin(dto: CreateAdminDto) {
    await this.repo.createTable();

    const existingAdmin = await this.repo.findAdminByEmail(dto.email);
    if (existingAdmin) {
      throw new CustomException(400, "This email already exist");
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    return await this.repo.createAdmin(dto.name, dto.email, passwordHash);
  }
}
