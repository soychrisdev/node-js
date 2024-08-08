import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config";
import { userModel } from "../../data/mongodb";

export class AuthMiddleware {
  // constructor(private readonly authUseCase: AuthUseCase) {}

  static validateJWT = async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.header('Authorization')

    if (!authorization) return res.status(401).json({ error: 'Unauthorized' })
    if (!authorization.includes('Bearer')) return res.status(401).json({ error: 'Unauthorized' })

    const token = authorization.split(' ').at(1) || '';

    try {

      const payload = await JwtAdapter.verifyToken<{ id: string }>(token)

      if (!payload) return res.status(401).json({ error: 'Token is not valid' })

      const user = await userModel.findById(payload.id)

      if (!user) return res.status(401).json({ error: 'User not found' })

      req.body.user = user
      next()
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' })
    }


    console.log('Middleware actioned')



  }
}