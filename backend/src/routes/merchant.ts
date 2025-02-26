import express from "express";
import { cookieConfig } from "../config/cookieconfig";
import { userController } from "../controllers/user";
import { verifyToken, verifyTokenMerchant } from "../utils/jwtUtils";
import { merchantController } from "../controllers/merchant";
const router = express();

const merchantControllers = new merchantController();
router.post("/signin", async (req, res) => {
  try {
    // Parse cookies from the request header
    const cookies = req.headers.cookie;

    if (!cookies || !cookies.includes("token=")) {
      const result = await merchantControllers.findMerchantUser(req.body);
      if (result instanceof Error) {
        return res.status(403).json({ error: "Error new while finding user" });
      }
      const { user, token } = result as any;

      res.cookie("token", token, cookieConfig);
      return res.status(201).json({ user });
    } else {
      const token = cookies.split("=")[1];
      const verifiedUser = verifyTokenMerchant(token);
      return res.status(201).json({ user: verifiedUser });
    }
  } catch (error) {
    console.error("Error in /signin route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/signup", async (req, res) => {
  try {
    const result = (await merchantControllers.createMerchantUser(
      req.body
    )) as unknown as {
      user: any;
      token: any;
    };

    res.cookie("token", result.token, cookieConfig);

    if (result instanceof Error) {
      return res.status(403).json({ error: "Error while  creating new user" });
    }
    const { user } = result;
    return res.status(201).json({
      user: "user created",
    });
  } catch (error) {
    res.status(403).json({ error: error });
  }
});

export default router;
