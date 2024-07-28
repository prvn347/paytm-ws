import { userSignup, userSignin } from "../types/user";
import bcrypt from "bcryptjs";

import { PrismaClient } from "@prisma/client";
import { generateToken } from "../utils/jwtUtils";
import { onrampType, transferType } from "../types/transfer";
const prisma = new PrismaClient();
export class userservice {
  async createUser(userData: userSignup) {
    try {
      const hashedPassword = await bcrypt.hashSync(userData.password, 10);
      const user = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            name: userData.name,

            email: userData.email,
            password: hashedPassword,
          },
        });
        await tx.userBalence.create({
          data: {
            userId: user.id,
          },
        });
        return user;
      });

      const token = generateToken(user.id);

      return { user, token };
    } catch (error) {
      return new Error("error while db user creation");
    }
  }
  async findUser(userData: userSignin) {
    try {
      const user = await prisma.user.findFirst({
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
        const token = generateToken(user.id);
        return { user, token };
      }
    } catch (error) {
      throw new Error("error while finding user");
    }
  }
  async transfer(transferData: transferType, userId: number) {
    try {
      const paymentDone = await prisma.$transaction(
        async (tx) => {
          await tx.$queryRaw`SELECT * FROM "UserBalence" WHERE "userId" = ${userId} FOR UPDATE`;
          const user = await tx.userBalence.findFirst({
            where: {
              userId: userId,
            },
          });
          if ((user?.amount || 0) < transferData.amount) {
            return false;
          }

          console.log("user balance check passed");
          await new Promise((r) => setTimeout(r, 10000));
          await tx.userBalence.update({
            where: {
              userId: userId,
            },
            data: {
              amount: {
                decrement: transferData.amount,
              },
            },
          });
          await tx.merchantBalence.update({
            where: {
              userId: transferData.merchantId,
            },
            data: {
              amount: {
                increment: transferData.amount,
              },
            },
          });
          console.log("transaction done");
          return true;
        },
        {
          maxWait: 50000, // default: 2000
          timeout: 100000,
        }
      );
      if (paymentDone) {
        return "payment done";
      } else {
        return "payment not done";
      }
    } catch (error) {
      throw new Error("error while transferring amoung from user");
    }
  }
  // create a webhook server for onramping
  async onramp(onrampData: onrampType, userId: number) {
    try {
      console.log("reached service of onramp");

      const resp = await prisma.userBalence.update({
        where: {
          userId: userId,
        },
        data: {
          amount: {
            increment: onrampData.amount,
          },
        },
      });
      console.log(resp);
      return resp;
    } catch (error) {
      console.log(error);
      throw new Error("error while onraming with the bank");
    }
  }
}
