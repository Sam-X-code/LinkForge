import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import urlRouter from "./routes/url.routes.js";
import { redirectUrl } from "./controllers/url.controller.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN ,
    credentials : true
}
))

app.use(express.json({limit : "16kb"}));
app.use(express.urlencoded({extended : true , limit : "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

// routes
app.use("/api/v1/users",userRouter)
app.use("/api/v1/urls",urlRouter)
app.get("/:shortCode", redirectUrl);

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.use(errorHandler)

export default app;