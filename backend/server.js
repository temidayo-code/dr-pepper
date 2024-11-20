const express = require("express");
const nodemailer = require("nodemailer");
const multer = require("multer");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({
    origin: [
        process.env.FRONTEND_URL,
        'http://localhost:3000',
    ],
    methods: ['GET', 'POST'],
    credentials: true
}));

const upload = multer();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

transporter.verify(function (error, success) {
    if (error) {
        console.log("Email server error:", error);
    } else {
        console.log("Email server is ready");
    }
});

app.get("/api/health", (req, res) => {
    res.json({ 
        status: "OK",
        message: "Server is running"
    });
});

app.post("/send-email", upload.none(), async (req, res) => {
    try {
        console.log("Received form data:", req.body);

        const {
            firstName,
            lastName,
            email,
            phone,
            address,
            city,
            state,
            zipCode,
            carMake,
            carModel,
            carYear,
        } = req.body;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: "New Dr Pepper Vehicle Wrap Application",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #c81533;">New Vehicle Wrap Application</h2>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px;">
                        <h3 style="color: #2d3436;">Personal Information</h3>
                        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Phone:</strong> ${phone}</p>
                        
                        <h3 style="color: #2d3436; margin-top: 20px;">Address Information</h3>
                        <p><strong>Street Address:</strong> ${address}</p>
                        <p><strong>City:</strong> ${city}</p>
                        <p><strong>State:</strong> ${state}</p>
                        <p><strong>ZIP Code:</strong> ${zipCode}</p>

                        <h3 style="color: #2d3436; margin-top: 20px;">Vehicle Information</h3>
                        <p><strong>Car Make:</strong> ${carMake}</p>
                        <p><strong>Car Model:</strong> ${carModel}</p>
                        <p><strong>Car Year:</strong> ${carYear}</p>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");

        res.status(200).json({
            success: true,
            message: "Thank you! Your application has been submitted successfully. We will contact you soon.",
        });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to submit your application. Please try again later.",
            error: error.message,
        });
    }
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
