import Url from "../models/url.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import  ApiResponse  from "../utils/ApiResponse.js";
import validator from "validator";
import { nanoid } from "nanoid";
import redisClient from "../config/redis.js";
import calculateExpiry from "../utils/calculateExpiry.js";
import { publishClickEvent } from "../queues/publisher.js";

// ...............create short url .........................


const createShortUrl = asyncHandler( async (req,res) => {

    let { originalUrl, customAlias , expiresIn } = req.body;
    console.log(req.body);

    const expiresAt = calculateExpiry(expiresIn);
    console.log("expiresIn:", expiresIn);
    console.log("expiresAt:", expiresAt);


    if (!/^https?:\/\//i.test(originalUrl)) {
        originalUrl = `https://${originalUrl}`;
    }

    if (!validator.isURL(originalUrl)) {
        throw new ApiError(400, "Invalid URL");
    }

    if(customAlias){
        const existingUrl = await Url.findOne({
            shortCode : customAlias
        });

        if(existingUrl){
            throw new ApiError(
            409,
            "Custom alias already exists")
        };

    };

    const shortCode = customAlias || nanoid(7);
    const url = await Url.create({
            originalUrl,
            shortCode,
            owner: req.user._id,
            expiresAt
    });

    const shortUrl = `${process.env.BASE_URL}/${shortCode}`;

    return res.status(201).json(
        new ApiResponse(201,
        {   shortCode,
            shortUrl
        }
        ,"Short URL created successfully")
    );

});






// ...................redirect url...............



const redirectUrl = asyncHandler(async (req, res) => {
    const { shortCode } = req.params;
    const cachedData = await redisClient.get(shortCode);

    if (cachedData) {
        console.log(`⚡ Cache HIT -> ${shortCode}`);
        const cached = JSON.parse(cachedData);

        if (cached.expiresAt && Date.now() > new Date(cached.expiresAt).getTime()) {
            await redisClient.del(shortCode);

            throw new ApiError(
                410,
                "This link has expired."
            );
        }

        await publishClickEvent({
            shortCode,
            ip: req.ip,
            userAgent: req.get("User-Agent"),
            referrer: req.get("Referer") || "Direct"
        });

        return res.redirect(url.originalUrl);
    }

// if not in cache 
    console.log(`📦 Cache MISS -> ${shortCode}`);  
    const url = await Url.findOne({
        shortCode
    });

    if (!url) {
        throw new ApiError(
            404,
            "Short URL not found"
        );
    }

    if (url.expiresAt && Date.now() > url.expiresAt.getTime()){
        throw new ApiError(
            410,
            "This link has expired."
        );
    }

   await publishClickEvent({
        shortCode,
        ip: req.ip,
        userAgent: req.get("User-Agent"),
        referrer: req.get("Referer") || "Direct"
    });

    let ttl = 3600;

    if (url.expiresAt) {
        ttl = Math.min(
            3600,
            Math.max(
                1,
                Math.floor((url.expiresAt.getTime() - Date.now()) / 1000)
            )
        );
    }

    await redisClient.set(shortCode,
        JSON.stringify({
            originalUrl: url.originalUrl,
            expiresAt: url.expiresAt
        }),
        {
            EX: ttl
        }
    );


    return res.redirect(url.originalUrl);
});






// ..............fetch all urls of a user.............



const getMyUrls = asyncHandler(async (req, res) => {

    // finds all urls
    const urls = await Url.find({
                owner: req.user._id})
                .select("originalUrl shortCode clicks createdAt");

    const formattedUrls = urls.map((url) => ({
        ...url.toObject(),
        shortUrl: `${process.env.BASE_URL}/${url.shortCode}`
    }));


    return res.status(200).json(
        new ApiResponse(
            200,
            formattedUrls,
            "URLs fetched successfully"
        )
    );
});



// ..................delete url........................


const deleteUrl = asyncHandler(async (req, res) => {

    const url = await Url.findOne({
        shortCode: req.params.shortCode
    });

    if (!url) {
        throw new ApiError(404, "URL not found");
    }

    if (url.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Forbidden");
    }

    await url.deleteOne();
    try {
        await redisClient.del(url.shortCode);
    } catch (error) {
        console.error("Redis cache invalidation failed:", error);
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "URL deleted successfully"
        )
    );
});




// ....................url Analytics....................


const getAnalytics = asyncHandler(async(req,res) =>{

    const url = await Url.findOne({
        shortCode: req.params.shortCode
    });
    
    if(!url){
        throw new ApiError(404,"Short URL not found");
    }

    if (url.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "Forbidden"
        );
    }

    const shortUrl = `${process.env.BASE_URL}/${url.shortCode}`;

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                originalUrl: url.originalUrl,
                shortCode: url.shortCode,
                shortUrl,
                clicks: url.clicks,
                createdAt: url.createdAt,
                updatedAt: url.updatedAt,
                expiresAt: url.expiresAt,
                isActive: url.isActive
            },
            "Analytics fetched successfully"
        )
    )

})




export  {createShortUrl,redirectUrl,getMyUrls,deleteUrl,getAnalytics};