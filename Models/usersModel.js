import { Schema, model } from "mongoose";
const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "UserName is required"],
        minlength: [2, "min length must be 2 char"],
        maxlength: [50, "max length must be 50 char"],
    },
    slug: {
        type: String,
        lowercase: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minlength: [6, "too short password"],
        maxlength: [14, "too long password"],
    },
    passwordChangedAt: { type: Date },
    passwordResetCode: { type: String },
    passwordResetCodeExpires: { type: Date },
    passwordResetCodeVerify: { type: Boolean },
},
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    // Hashing user password
    this.password = await bcrypt.hash(this.password, 12);
    next();
});
export default model("userModel", userSchema);
