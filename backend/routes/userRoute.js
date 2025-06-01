import express from 'express';
import { currentUser, login, logout, signUp,getAllUsers } from '../controllers/userController.js';
import { isAuth } from '../middleware/isAuth.js';
import { isAdmin } from '../middleware/isAuth.js';

const userRouter = express.Router();

userRouter.post("/signup",signUp)
userRouter.post("/login",login)

userRouter.get("/current-user",isAuth,currentUser)

userRouter.get("/logout",isAuth,logout);

userRouter.get("/all-users",isAdmin,isAdmin,getAllUsers)

export default userRouter;