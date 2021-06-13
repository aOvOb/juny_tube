import express from "express";
import {edit, remove, login, logout, see} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/edit", edit);
userRouter.get("/remove", remove);
userRouter.get(":id", see);
userRouter.get("/login", login);
userRouter.get("/logout", logout);


export default userRouter;