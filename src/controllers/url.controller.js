import Url from "../models/url.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import  ApiResponse  from "../utils/ApiResponse.js";
import validator from "validator";
import { nanoid } from "nanoid";

// ...............create short url .........................


const createShortUrl = asyncHandler( async (req,res) => {

    const { originalUrl, customAlias } = req.body;
    if (!validator.isURL(originalUrl)) {
        throw new ApiError(400, "Invalid URL");
    };

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
            owner: req.user._id
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

    const url = await Url.findOne({
        shortCode
    });

    if (!url) {
        throw new ApiError(
            404,
            "Short URL not found"
        );
    }

    await Url.findByIdAndUpdate(
        url._id,
        {
            $inc: {
                clicks: 1
            }
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

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "URL deleted successfully"
        )
    );
});


export  {createShortUrl,redirectUrl,getMyUrls,deleteUrl};