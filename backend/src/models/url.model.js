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
        },
        expiresAt: {
            type: Date,
            default: null
        }
    },{timestamps : true}
    
);

urlSchema.virtual("isActive").get(function () {
    return (
        !this.expiresAt ||
        Date.now() < this.expiresAt.getTime()
    );
});

urlSchema.set("toJSON", { virtuals: true });
urlSchema.set("toObject", { virtuals: true });

const Url = mongoose.model("Url" , urlSchema);
export default Url;


