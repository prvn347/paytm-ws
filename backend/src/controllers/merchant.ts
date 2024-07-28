import { merchantService } from "../services/merchant";
import { userSignin, userSignup } from "../types/user";

export class merchantController {
  userService = new merchantService();

  async createMerchantUser(userData: userSignup) {
    try {
      return await this.userService.createMerchantUser(userData);
    } catch (error) {
      return new Error("error while creating user.");
    }
  }
  async findMerchantUser(userData: userSignin) {
    try {
      return await this.userService.findMerchantUser(userData);
    } catch (error) {
      return new Error("error while creating user.");
    }
  }
}
