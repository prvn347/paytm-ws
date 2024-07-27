import { merchantService } from "../services/merchant";
import { userservice } from "../services/user";
import { user } from "../types/user";

export class merchantController {
  userService = new merchantService();

  async createMerchantUser(userData: user) {
    try {
      return await this.userService.createMerchantUser(userData);
    } catch (error) {
      return new Error("error while creating user.");
    }
  }
  async findMerchantUser(userData: user) {
    try {
      return await this.userService.findMerchantUser(userData);
    } catch (error) {
      return new Error("error while creating user.");
    }
  }
}
