import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import  ApiResponse  from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return {accessToken,refreshToken};
    } 
    catch (error) {
        throw new ApiError(500,"Something went wrong while generating access and refresh tokens");
    }
};


// ..............register user............................
const registerUser = asyncHandler(async (req, res) => {

    const { username, fullName, email, password } = req.body;

    if ([username, fullName, email, password].some(
        (field) => !field || field?.trim() === "")
    ) {  throw new ApiError(400, "All fields are required"); }

    const existedUser = await User.findOne( { $or: [ { username }, { email } ] } );
    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }

    const user = await User.create(
        {
            username,
            fullName,
            email,
            password
        }
    );

    const createdUser = await User.findById(user._id).select("_id username fullName email createdAt updatedAt");
    if (!createdUser) {
        throw new ApiError( 500 , "Something went wrong while registering the user" );
    }

    return res.status(201).json(
        new ApiResponse(201,createdUser,"User registered successfully")
    );
})

// .............login user...........................
const loginUser = asyncHandler(async(req , res) => {
    const { username,email, password } = req.body;

    if ((!username && !email) || !password) {
        throw new ApiError(400, "Username/email and password are required");
    }

    const user = await User.findOne( { $or: [ { username }, { email } ] } );
    if (!user) {
        throw new ApiError(401, "Invalid Credentials!");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid) {
        throw new ApiError(401, "Invalid Credentials!");
    }

    const { accessToken, refreshToken } = 
        await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken -__v");

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    };

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {user: loggedInUser},
            "Logged in successfully"
        )
    );

})

// ..............logout user............................
const logoutUser = asyncHandler(async(req,res) => {
    
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        }
    );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    };

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(
            200,
            {},
            "User logged out successfully"
        )
    );

})




// ...................refresh access token................




const refreshAccessToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken =
        req.cookies?.refreshToken ||
        req.body?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(
            401,
            "Unauthorized request"
        );
    }

    try {

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(
            decodedToken._id
        );

        if (!user) {
            throw new ApiError(
                401,
                "Invalid refresh token"
            );
        }

        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(
                401,
                "Refresh token is expired or used"
            );
        }

        const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(
            user._id
        );

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        };

        return res
            .status(200)
            .cookie("accessToken",accessToken,options)
            .cookie("refreshToken",refreshToken,options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken
                    },
                    "Access token refreshed successfully"
                )
            );

    } catch (error) {

        throw new ApiError(
            401,
            "Invalid refresh token"
        );

    }
});

// ..........current user....................
const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(
            200,
            req.user,
            "Current user fetched successfully"
        )
    );
});





export {registerUser,loginUser,logoutUser,refreshAccessToken,getCurrentUser};

