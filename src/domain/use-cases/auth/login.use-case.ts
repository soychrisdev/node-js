import { JwtAdapter } from "../../../config";
import { LoginUserDto } from "../../dtos/auth/login-user.dto";
import { CustomError } from "../../errors/custom.error";
import { AuthRepository } from "../../repositories/auth.repository";

interface LoginUserResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  }
}

interface LoginUserUseCase {
  execute(loginUserDto: LoginUserDto): Promise<LoginUserResponse>
}

export class LoginUseCase implements LoginUserUseCase {

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: (payload: Object, duration?: string) => Promise<string | null> = JwtAdapter.generateToken
  ) { }

  async execute(loginUserDto: LoginUserDto): Promise<LoginUserResponse> {

    const user = await this.authRepository.login(loginUserDto)
    const { name, id, email } = user

    const token = await this.signToken({ id: id })

    if (!token) throw CustomError.internal("[TOKEN] Internal Server Error")

    return {
      token: token,
      user: {
        id: id,
        name: name,
        email: email
      }

    }
  }
}