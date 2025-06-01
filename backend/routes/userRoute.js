import express from 'express';
import { currentUser, login, logout, signUp,getAllUsers } from '../controllers/userController.js';
import { isAuth } from '../middleware/isAuth.js';

const userRouter = express.Router();

userRouter.post("/signup",signUp)
userRouter.post("/login",login)

userRouter.get("/current-user",isAuth,currentUser)

userRouter.get("/logout",logout);

userRouter.get("/all-users",getAllUsers)

export default userRouter;