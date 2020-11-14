const mongoose = require("../db/mongoose")
const passportLocalMongoose = require("passport-local-mongoose")
const validator = require("validator")
const Book = require("./book")

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        uppercase: true
    },
    Name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 20
    },
    password: {
        type: String,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    User_Photo: {
        data: Buffer,
        contentType: String
    },
    Address: {
        type: String,
        trim: true
    },
    Ph_No: {
        type: Number,
        required: true,
        unique: true,
        default: 9999999999
    },
    Email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid")
            }
        }
    },
    No_of_request: {
        type: Number,
        default: 0
    },
    No_of_uploads: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

// userSchema.virtual("uploads", {
//      ref: "upload",
//      localField: "_id",
//      foreignField: "UUSN"
//  })


userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema)
module.exports = User