import { userSignin, userSignup } from "../types/user";
import bcrypt from "bcryptjs";

import { PrismaClient } from "@prisma/client";
import { generateToken, generateTokenMerchant } from "../utils/jwtUtils";
const prisma = new PrismaClient();
export class merchantService {
  async createMerchantUser(userData: userSignup) {
    try {
      const hashedPassword = await bcrypt.hashSync(userData.password, 10);
      const user = await prisma.merchant.create({
        data: {
          name: userData.name,

          email: userData.email,
          password: hashedPassword,
        },
      });

      const token = generateTokenMerchant(user.id);

      return { user, token };
    } catch (error) {
      return new Error("error while db user creation");
    }
  }
  async findMerchantUser(userData: userSignin) {
    try {
      const user = await prisma.merchant.findFirst({
        where: {
          email: userData.email,
        },
      });
      if (!user) {
        throw new Error("User not found");
      }
      const isValidPassword = await bcrypt.compare(
        userData.password,
        user?.password || ""
      );
      if (!isValidPassword) {
        throw new Error("wrong password");
      }
      if (isValidPassword) {
        const token = generateTokenMerchant(user.id);
        return { user, token };
      }
    } catch (error) {
      throw new Error("error while finding user");
    }
  }
}
