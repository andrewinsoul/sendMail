// include nodemailer
const nodemailer = require('nodemailer');
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const {google} = require('googleapis');

const OAuth2 = google.auth.OAuth2;
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })


dotenv.config();

const app = express();
const OAuth2Client = new OAuth2(
  {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: 'https://developers.google.com/oauthplayground'
  }
);

OAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN
});

app.post('/send', jsonParser, urlencodedParser, async (req, res) => {
  try {
    const accessToken = await OAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: "OAuth2",
        user: 'andrewinsoul@gmail.com',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  
    // email options
    let mailOptions = {
      from: process.env.ACCOUNT_EMAIL,
      to: process.env.ACCOUNT_EMAIL,
      subject: process.env.SUBJECT,
      text: req.body.email
    };
  
    // send email
    transporter.sendMail(mailOptions, (error, response) => {
      if (error) {
        return res.status(500).send({
          status: 'false',
          message: 'An error occured',
          error
        })
      }
      console.log('response >>>>> ', response);
      return res.status(200).send({
        status: 'success',
        message: 'Email successfully sent'
      });
    });

  } catch (error) {
    return res.status(500).send({
      success: false,
      error
    })
  }
});
app.get('/', (_, res) => {
  return res.status(200).json({
    status: 'success',
    message: 'Halleujah, its working!!!'
  })
})

const port = parseInt(process.env.PORT, 10) || 8000;
app.listen(port, () => console.log(`server live on port ${port}`));