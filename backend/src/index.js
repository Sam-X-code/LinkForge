import dotenv from "dotenv"
import app from "./app.js"
import connectDB from "./db/dbConnection.js"
import redisClient from "./config/redis.js";

dotenv.config({
    path:"./.env"
})

connectDB()
.then(async () => {
    try {
        await redisClient.connect();
        console.log("✅ Redis Connected");
    } catch (error) {
        console.log("⚠️ Redis unavailable. Running without cache.");
    }
    
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port : ${process.env.PORT}`);
    });

})
.catch((error) => {
    console.log("Server startup failed!!", error);
});


