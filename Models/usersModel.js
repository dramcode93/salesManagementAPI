import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs'
const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "UserName is required"],
        minlength: [2, "min length must be 2 char"],
        maxlength: [50, "max length must be 50 char"],
        unique: true,
        lowercase: true,
    },
    slug: {
        type: String,
        lowercase: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minlength: [6, "too short password"],
        maxlength: [14, "too long password"],
    },
    role: {
        type: String,
        enum: ["user", "admin", "manager"],
        default: "user"
    },
    active: {
        type: Boolean,
        default: true
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: "userModel"
    }],
    adminUser: {
        type: Schema.Types.ObjectId,
        ref: "userModel"
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
}).pre(/^find/, function (next) {
    this.populate({ path: 'users', select: '-password' });
    next();
});
export default model("userModel", userSchema);
