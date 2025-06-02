import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    
    role: { type: String, enum: ["admin", "worker","manager"], default: "worker", required: true }
});


const User = mongoose.model('User', userSchema);
export default User;