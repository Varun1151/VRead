const mongoose = require("../db/mongoose")

var feedbackschema = new mongoose.Schema({
    USN: {
        type: mongoose.Schema.Types.String,
        ref: "User",
        required: true
    },
    Book_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true
    },
    Feedback_msg: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})



const Feedback = mongoose.model("Feedback", feedbackschema)
module.exports = Feedback