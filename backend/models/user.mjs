import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Please use a valid email address'],
    },
    resetToken: String,
    resetTokenExpiry: Date
});

// hashing the password before saving it to the database
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// compare the password in the database
userSchema.methods.isValidPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;