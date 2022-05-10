import * as jwt from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";
import User from "../model/User";

const NAMESPACE = "Auth middlewares";

const jwtVerify = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token: string = req.header("authorization")!.replace("Bearer ", "");

    const decoded: any = jwt.verify(token!, process.env.JWT_SECRET!);

    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }

    req.body.token = token;
    req.body.user = user;

    next();
  } catch (error) {
    res.status(401).send({ error: "Please log in the app." });
  }
};

export { jwtVerify };
