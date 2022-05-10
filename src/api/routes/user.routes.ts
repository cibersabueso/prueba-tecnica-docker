import express from "express";
import { login, logout, register } from "../controllers";
import { jwtVerify } from "../middlewares/jwtVerify";

const router = express.Router();

router.post("/login", login);

router.post("/register", register);

router.post("/logout", jwtVerify, logout);

export default router;