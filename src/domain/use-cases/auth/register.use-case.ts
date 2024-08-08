import { JwtAdapter } from "../../../config";
import { RegisterUserDto } from "../../dtos/auth/register-user.dto";
import { CustomError } from "../../errors/custom.error";
import { AuthRepository } from "../../repositories/auth.repository";


interface RegisterUserResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  }
}
interface RegisterUserUseCase {
  execute(registerUserDto: RegisterUserDto): Promise<RegisterUserResponse>
}
export class RegisterUseCase implements RegisterUserUseCase {

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: (payload: Object, duration?: string) => Promise<string | null> = JwtAdapter.generateToken
  ) { }

  async execute(registerUserDto: RegisterUserDto): Promise<RegisterUserResponse> {

    const user = await this.authRepository.register(registerUserDto)
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