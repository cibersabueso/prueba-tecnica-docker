import { Request, Response } from "express";
import { generateAuthToken } from "../helpers";
import User from "../model/User";

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  try {
    //encontrar al user por email y password
    const user = await User.findByCredentials(email, password);

    if (!user) return res.sendStatus(401); //Unauthorized

    //creamos el token
    const token = await generateAuthToken(user);

    res.send({ user, token });
  } catch (error) {
    return res.status(400).send(error); //error
  }
};

const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = new User({ email, password });
  try {
    const userDb = await user.save();

    const token = await generateAuthToken(userDb);

    res.status(201).send({userDb, token})
  } catch (error) {
    res.status(400).send(error);
  }
};
const logout = async (req: Request, res: Response) => {
  try {
    req.body.user.tokens = req.body.user.tokens.filter((token: any) => {
      return token.token !== req.body.token;
    });
    await req.body.user.save();

    return res.send({ user: req.body.user, msg: "Logged out" });
  } catch (error) {
    res.status(500).send(error);
  }
};

export { login, register, logout };
