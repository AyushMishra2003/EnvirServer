import { Router } from "express";
import  {login,register } from "../controllers/user.controller.js";
import upload from "../middleware/multer.middleware.js";

const userRoutes=Router()

userRoutes.post('/register',upload.single("avatar"),register)
userRoutes.post('/login',login)


export default userRoutes