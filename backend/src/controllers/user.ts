import { userservice } from "../services/user";
import { onrampType, transferType } from "../types/transfer";
import { userSignin, userSignup } from "../types/user";

export class userController {
  userService = new userservice();

  async createUser(userData: userSignup) {
    try {
      return await this.userService.createUser(userData);
    } catch (error) {
      return new Error("error while creating user.");
    }
  }
  async findUser(userData: userSignin) {
    try {
      return await this.userService.findUser(userData);
    } catch (error) {
      return new Error("error while finding user.");
    }
  }
  async onramp(onrampData: onrampType, userId: number) {
    try {
      return await this.userService.onramp(onrampData, userId);
    } catch (error) {
      return new Error("error while onramping.");
    }
  }
  async transfer(transferData: transferType, userId: number) {
    try {
      return await this.userService.transfer(transferData, userId);
    } catch (error) {
      return new Error("error while transferring amount.");
    }
  }
}
