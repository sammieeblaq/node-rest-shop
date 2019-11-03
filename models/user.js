const mongooose = require("mongoose");

const userSchema = mongooose.Schema({
    email: {
        type: String, 
        required: true, 
        unique: true,
        // match: 
    }, 
    password: { type: String, required: true }
});

const User = mongooose.model("User", userSchema);

module.exports = User;