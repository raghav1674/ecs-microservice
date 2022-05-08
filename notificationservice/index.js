const express = require("express")
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.AWS_SES_SMTP_HOST,
    port: 587,
    secure: false, 
    auth: {
        user: process.env.AWS_SES_SMTP_USERNAME, 
        pass: process.env.AWS_SES_SMTP_PASSWORD, 
    },
});

const app = express();
app.use(express.json())

app.use("/",(req,res,next)=>{

    res.setHeader("Access-Control-Allow-Origin","*")
    res.setHeader("Access-Control-Allow-Methods","GET,POST,OPTIONS")
    res.setHeader("Access-Control-Allow-Headers","*")
    next();
})

app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Notification Service is running fine' })
})

app.post('/notify', async (req, res) => {

    const { firstName, lastName } = req.body;

    try {
        const info = await transporter.sendMail({
            from: process.env.AWS_SES_FROM_EMAIL,
            to: process.env.AWS_SES_TO_EMAIL,
            subject: "User created",
            text: `Hello ${firstName} ${lastName}`,
        });

        res.status(200).json({ message: `Email send ${info.messageId}` })
    } catch (error) {
        res.status(500).json({ error: 'Some error occurred' })
    }

})

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Notification Service is running on port ${port}`)
})