const mongoose = require("../db/mongoose")

var bookSchema = new mongoose.Schema({
    Book_name: {
        type: String,
        trim: true,
        required: true
    },
    Dept: {
        type: String,
        trim: true,
        default: null
    },
    Subject: {
        type: String,
        trim: true,
        default: null
    },
    Cover_page_photo: {
        data: Buffer,
        contentType: String
    },
    Price: {
        type: Number,
        required: true
    },
    Author: {
        type: String,
        trim: true,
        required: true
    },
    Edition: {
        type: String,
        trim: true,
        default: null
    },
    UUSN: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    RUSN: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    },
    Upload_date: {
        type: Date,
        default: Date.now
    },
    Request_status: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})



const Book = mongoose.model("Book", bookSchema)
module.exports = Book