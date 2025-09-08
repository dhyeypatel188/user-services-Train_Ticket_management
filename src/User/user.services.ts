import bcrypt from "bcrypt";
import { CustomException } from "../exception/custom.exception";
import { UserRepository } from "./user.repository";
import { CreateUserDto } from "./user.dto";
import { AuthRepository } from "../Auth/auth.repository";
import { TokenUtil } from "../utils/token.utils"; 
import { ResponseUtil } from "../utils/response.utils";
import { AdminRepository } from "../Admin/admin.repository";
const SALT_ROUNDS = 10;

export class UserService {
  private userRepository: UserRepository;
  private authRepo: AuthRepository;
  private adminRepository: AdminRepository;

  constructor() {
    this.userRepository = new UserRepository();
        this.authRepo = new AuthRepository();
    this.adminRepository = new AdminRepository();
  }

  async createUser(dto: CreateUserDto) {

  await this.adminRepository.createTable()
    const existingAdmin = await this.userRepository.findUserByEmail(dto.email);
    if (existingAdmin) {
      throw new CustomException(400, "This email already exist");
    }
    console.log("existingAdmin");
    console.log(existingAdmin);

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user =  await this.userRepository.createUser(
      dto.name,
      dto.email,
      passwordHash
    );

    const accessToken = TokenUtil.generateAccessToken(user);
        const refreshToken = TokenUtil.generateRefreshToken(user);
    
        await this.authRepo.saveRefreshToken(user.user_id!, refreshToken, accessToken);
    
        const responseData: any = {
          user_id: user.user_id!.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          accessToken,
          refreshToken,
        };
    
        return responseData   
  }

  async deleteUser(user_id: string) {
    const user = await this.userRepository.findUserById(user_id);
    if (!user) {
      throw new CustomException(400, "User not found");
    }

    return await this.userRepository.deleteUser(user_id);
  }
}
