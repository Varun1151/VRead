var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '1ms18cs133@gmail.com',
        pass: 'riudhr3dhr3iohfr3iofh'
    }
});


module.exports = transporter