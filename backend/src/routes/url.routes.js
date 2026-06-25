import express from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {createShortUrl,deleteUrl,getMyUrls,getAnalytics} from "../controllers/url.controller.js";

const urlRouter = express.Router();

urlRouter.route("/create").post(verifyJWT, createShortUrl);
urlRouter.route("/my-urls").get(verifyJWT, getMyUrls);
urlRouter.route("/delete/:shortCode").delete(verifyJWT, deleteUrl);
urlRouter.route("/analytics/:shortCode").get(verifyJWT, getAnalytics);

export default urlRouter;
