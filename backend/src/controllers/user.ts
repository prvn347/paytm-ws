import { userservice } from "../services/user";
import { user } from "../types/user";

export class userController {
  userService = new userservice();

  async createUser(userData: user) {
    try {
      return await this.userService.createUser(userData);
    } catch (error) {
      return new Error("error while creating user.");
    }
  }
  async findUser(userData: user) {
    try {
      return await this.userService.findUser(userData);
    } catch (error) {
      return new Error("error while creating user.");
    }
  }
}
