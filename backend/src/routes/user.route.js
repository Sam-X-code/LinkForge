import express from 'express';
import {registerUser,loginUser,logoutUser,refreshAccessToken,getCurrentUser} from '../controllers/user.controller.js';
import verifyJWT from '../middlewares/auth.middleware.js';
import rateLimiter from '../middlewares/rateLimiter.middleware.js';




const userRouter = express.Router();

userRouter.route("/register").post(rateLimiter(5,60),registerUser);
userRouter.route("/login").post(rateLimiter(5,60),loginUser);
userRouter.route("/logout").post(verifyJWT,logoutUser);
userRouter.route("/refresh-token").post(refreshAccessToken);
userRouter.route("/current-user").get(verifyJWT,getCurrentUser);



export default userRouter;