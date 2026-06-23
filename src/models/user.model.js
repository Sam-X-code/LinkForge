import mongoose ,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new Schema(
    {
        username : {
            type : String,
            required : true,
            unique : true,
            trim : true,
            lowercase : true
        },
        fullName : {
            type : String,
            required : true,
            trim : true,
        },
        email : {
            type : String,
            required : true,
            unique : true,
            trim : true,
            lowercase : true
        },
        password : {
            type : String,
            required : true,
        },
        refreshToken: {
            type: String
        },

    },{timestamps : true}
);

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return ;
    this.password = await bcrypt.hash(this.password , Number(process.env.BCRYPT_SALT_ROUNDS));
});

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password , this.password);
};

userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
        _id: this._id,
        email: this.email,
        username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};

const User = mongoose.model("User",userSchema);
export default User;