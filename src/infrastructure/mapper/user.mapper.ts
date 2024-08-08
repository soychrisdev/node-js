import { CustomError, UserEntity } from "../../domain";

export class UserMapper {

  static toEntity(object: { [key: string]: any }) {
    const { id, _id, name, email, password, role } = object;

    if (!id || !_id) throw CustomError.badRequest("id is required");
    if (!name) throw CustomError.badRequest("name is required");
    if (!email) throw CustomError.badRequest("email is required");
    if (!role) throw CustomError.badRequest("role is required");
    if (!password) throw CustomError.badRequest("password is required");

    return new UserEntity(id || _id, name, email, password, role);
  }
}