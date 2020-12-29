var multer = require('multer');
const upload = multer({
    limits: {
        fileSize: 2000000 //2 MB size is specified in bytes
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("Please upload a image"))
        }
        cb(undefined, true)
    }
})

module.exports = upload