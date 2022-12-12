const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({

    username: {
        type: String,
    },
    googleid: {
        type: String,
    },
    pic: {
        type: String,
    },
    rollnumber: {
        type: Number,
    },
    branch: {
        type: String,
    },
    studentno: {
        type: Number,
    },
    email: {
        type: String
    },
    orderId: {
        type: String,
    },

})

User = mongoose.model('User', userSchema)
module.exports = User;


