import express from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {createShortUrl,deleteUrl,getMyUrls} from "../controllers/url.controller.js";

const urlRouter = express.Router();

urlRouter.route("/create").post(verifyJWT, createShortUrl);
urlRouter.route("/my-urls").get(verifyJWT, getMyUrls);
urlRouter.route("/:id").delete(verifyJWT,deleteUrl);

export default urlRouter;
