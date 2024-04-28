import { Router } from "express";
import  {login,register } from "../controllers/user.controller.js";
import upload from "../middleware/multer.middleware.js";
import { addTeam, deleteTeam, getTeam, handleTeam } from "../controllers/team.controller.js";
import { addFoodProduct, getFoodProduct } from "../controllers/foodproduct.controller.js";

const userRoutes=Router()

userRoutes.post('/register',upload.single("avatar"),register)
userRoutes.post('/login',login)


userRoutes.post('/team',upload.single("teamImage"),addTeam)
userRoutes.get('/team',getTeam)
userRoutes.put('/team/:id',upload.single("teamImage"),handleTeam)
userRoutes.delete('/team/:id',deleteTeam)

userRoutes.post('/food',upload.single("foodImage"),addFoodProduct)
userRoutes.get('/food',getFoodProduct)

export default userRoutes