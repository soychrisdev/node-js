import jwt from 'jsonwebtoken';
import { envs } from './envs';

const MAX_DURATION = '2h';
const JWT_SEED = envs.JWT_SEED;

export class JwtAdapter {
  static async generateToken(payload: Object, duration: string = MAX_DURATION): Promise<string | null> {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, JWT_SEED, { expiresIn: duration }, (err, token) => {
        if (err) {
          console.log(err);
          return reject(null);
        }
        return resolve(token!);
      })
    });
  }

  static verifyToken<T>(token: string): Promise<T | null> {
    return new Promise((resolve) => {
      jwt.verify(token, JWT_SEED, (err, decoded) => {
        if (err) return resolve(null);

        return resolve(decoded as T);
      })
    });
  }
}