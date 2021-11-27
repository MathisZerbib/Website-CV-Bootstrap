require('dotenv').config();
var express = require('express');
var app = express();
const fetch = require('isomorphic-fetch');
const path = require('path');
const port = 3000;
const nodemailer = require('nodemailer');
const log = console.log;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// const handleSend = (req, res) => {
//     const secret_key = process.env.SECRET_KEY;
//     const token = req.body.token;
//     const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`;

//     fetch(url, {
//         method: 'post'
//     })
//         .then(response => response.json())
//         .then(google_response => {
//             res.json({ google_response });
//             console.log(google_response.success)
//             if (google_response.success === true) {
//                 var from = req.body.email;
//                 var to = "mathis.zerbib.webmaster@gmail.com";
//                 var subject = req.body.need;
//                 var text = req.body.message

//                 // Step 1
//                 let transporter = nodemailer.createTransport({
//                     service: 'gmail',
//                     auth: {
//                         user: process.env.EMAIL,
//                         pass: process.env.PASSWORD
//                     }
//                 });

//                 // Step 2
//                 let mailOptions = {
//                     from: from,
//                     to: to,
//                     subject: subject,
//                     text: text + "\n from: " + from
//                 };

//                 // Step 3
//                 transporter.sendMail(mailOptions, (err, data) => {
//                     if (err) {
//                         return log('Error occurs');
//                     }
//                     return log('Email sent!!!');
//                 });
//             }else {
//                 return
//             }


//         })
//         .catch(error => res.json({ error }));
       
//     }

const handleSend = (req, res) => {
    const secret_key = process.env.SECRET_KEY;
    // 

    const token = req.body.token;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`;

    fetch(url, {
        method: 'post'
    }).then(response => {
        if (response.ok) {
            response.json().then((data) => {
                console.log(data);
                if (data.success === true) {
                    var from = req.body.email;
                    var to = "mathis.zerbib.webmaster@gmail.com";
                    var subject = req.body.need;
                    var text = req.body.message

                    // Step 1
                    let transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: process.env.EMAIL,
                            pass: process.env.PASSWORD
                        }
                    });

                    // Step 2
                    let mailOptions = {
                        from: from,
                        to: to,
                        subject: subject,
                        text: text + "\n from: " + from
                    };

                    // Step 3
                    transporter.sendMail(mailOptions, (err, data) => {
                        if (err) {
                            res.sendFile(path.join(__dirname, '/public/error500.html'));
                            return log('Error occurs');
                        }
                        res.sendFile(path.join(__dirname, '/public/thank-you.html'));
                        return log('Email sent!!!');
                    });
                }

            });
        } else {
            throw 'There is something wrong';
        }
    }).
        catch(error => {
            console.log(error);
        });


};



app.post('/send', handleSend);
app.use(express.static('public'));
app.listen(port, () => console.log(`Listening on port ${port}!`));

