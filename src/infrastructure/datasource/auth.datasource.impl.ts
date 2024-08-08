import { BcryptAdapter } from "../../config";
import { userModel } from "../../data/mongodb";
import { AuthDatasource, CustomError, RegisterUserDto, UserEntity } from "../../domain";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import { UserMapper } from "../mapper/user.mapper";

export class AuthDataSourceImpl implements AuthDatasource {

  constructor(
    private readonly compare: (password: string, hash: string) => boolean = BcryptAdapter.compare,
    private readonly hash: (password: string) => string = BcryptAdapter.hash
  ) { }
  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {

    const { email, name, password, } = registerUserDto;

    try {

      //1. Verificar si el correo ya existe

      const userExists = await userModel.findOne({ email: email });

      if (userExists) throw CustomError.badRequest("User already exists");

      //2. Hash de la contraseña

      //3. Mapear la respuesta a nuestra entidad.


      const user = await userModel.create({ email: email, name: name, password: this.hash(password) });

      await user.save();

      return UserMapper.toEntity(user);

    } catch (error) {

      if (error instanceof CustomError) {
        throw error
      }

      throw CustomError.internal("Internal Server Error")
    }

  }

  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {

    const { email, password } = loginUserDto;

    try {

      //1. Verificar si el usuario existe

      const user = await userModel.findOne({ email: email });

      if (!user) throw CustomError.badRequest("User not found");

      //2. Comparar la contraseña

      const isValidPassword = this.compare(password, user.password);

      if (!isValidPassword) throw CustomError.badRequest("Invalid credentials");

      return UserMapper.toEntity(user);

    } catch (error) {

      if (error instanceof CustomError) {
        throw error
      }

      throw CustomError.internal("Internal Server Error")
    }
  }

}