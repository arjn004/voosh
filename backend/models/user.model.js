import mongoose from "mongoose";

// Task schema definition
const taskSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId() // Generate new ObjectId for each task
    },
    taskName: {
        type: String,
        required: true
    },
    taskDescription: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["TODO", "INPROGRESS", "DONE"]
    }
}, { timestamps: true }); // Re-enabled automatic _id and kept timestamps for task schema

// User schema definition
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true,
        unique: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    tasks: {
        type: [taskSchema],
        required: false, // The tasks array itself is not required
    }
}, { timestamps: true }); // Ensuring timestamps are enabled for user schema

const User = mongoose.model("User", userSchema);

export default User;

