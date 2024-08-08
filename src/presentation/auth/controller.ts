import { Request, Response } from 'express';
import { AuthRepository, CustomError, RegisterUserDto, RegisterUseCase } from '../../domain';
import { JwtAdapter } from '../../config';
import { userModel } from '../../data/mongodb';
import { LoginUseCase } from '../../domain/use-cases/auth/login.use-case';
import { LoginUserDto } from '../../domain/dtos/auth/login-user.dto';

export class AuthController {

  //DI
  constructor(
    private readonly authRepository: AuthRepository
  ) { }

  private handleError(error: unknown, res: Response) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message })
    }
    console.log(error) //Winston
    return res.status(500).json({ error: 'Internal server error' })
  }

  registerUser = (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body)

    if (error) return res.status(400).json({ error })

    new RegisterUseCase(this.authRepository)
      .execute(registerUserDto!)
      .then(response => res.json(response))
      .catch(err => this.handleError(err, res))

  }

  loginUser = (req: Request, res: Response) => {


    const [error, loginUserDto] = LoginUserDto.login(req.body)
    if (error) return res.status(400).json({ error })
    new LoginUseCase(this.authRepository)
      .execute(loginUserDto!)
      .then(response => res.json(response))
      .catch(err => this.handleError(err, res))

  }

  getUsers = (req: Request, res: Response) => {
    userModel.find().then(users => res.json({ users, token: req.body.user })).catch(err => this.handleError(err, res))
  }

}