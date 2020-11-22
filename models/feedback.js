const mongoose = require("../db/mongoose")

var feedbackschema = new mongoose.Schema({
    USN: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    Book_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
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