import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {

    const { username, fullName, email, password } = req.body;

    if ([username, fullName, email, password].some(
        (field) => field?.trim() === "")
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

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new ApiError( 500 , "Something went wrong while registering the user" );
    }

    return res.status(201).json(
        new ApiResponse(201,createdUser,"User registered successfully")
    );
})


export { registerUser };