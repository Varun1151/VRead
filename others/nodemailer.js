var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '1ms18cs133@gmail.com',
        pass: 'I cannot disclose it xD'
    }
});


module.exports = transporter