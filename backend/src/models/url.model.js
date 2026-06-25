import mongoose , {Schema} from "mongoose";

const urlSchema = new Schema(
    {
        originalUrl: {
            type: String,
            required: true
        },

        shortCode: {
            type: String,
            required: true,
            unique: true
        },

        clicks: {
            type: Number,
            default: 0
        },

        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },{timestamps : true}
    
);

const Url = mongoose.model("Url" , urlSchema);
export default Url;


