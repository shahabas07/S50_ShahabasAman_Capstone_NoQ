const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto'); // For generating OTP
const path = require('path');
const app = express();

// Temporarily store OTPs (use a database in production)
let otpStore = {};

// Middleware to parse JSON requests
app.use(express.json());

// Generate and send OTP
app.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  // Generate OTP
  // const otp = crypto.randomInt(1000, 9999).toString();
  const otp = "1000";


  // Store OTP with expiration (5 minutes)
  otpStore[email] = {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  };

  // Send OTP via email
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    html: `
      <p>Your OTP is <strong>${otp}</strong>. It will expire in 5 minutes.</p>
      <img src="cid:image1@company.com" alt="Example Image" style="width: 100%; max-width: 600px;">
    `,
    attachments: [
      {
        filename: 'NoQ.png',
        path: path.join('Email', 'NoQ.png'), // Corrected path
        cid: 'image1@company.com'
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('OTP sent');
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).send('Error sending OTP');
  }
});

// Verify OTP
app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (!otpStore[email]) {
    return res.status(400).send('OTP not found');
  }

  const { otp: storedOtp, expiresAt } = otpStore[email];

  if (Date.now() > expiresAt) {
    return res.status(400).send('OTP expired');
  }

  if (storedOtp === otp) {
    res.status(200).send('OTP verified');
    // Optionally, delete the OTP after successful verification
    delete otpStore[email];
  } else {
    res.status(400).send('Invalid OTP');
  }
});

// Send confirmation email

app.post('/confirm-email', async (req, res) => {
  const { appointment } = req.body;

  try {
    // Ensure that the appointment object is provided
    if (!appointment) {
      return res.status(400).json({ message: 'Appointment data is required' });
    }

    // Extract necessary details from the appointment object
    const { customerName, appointmentDate, time, location, adminName, email } = appointment;

    if (!email) {
      return res.status(400).json({ message: 'Email address is missing' });
    }

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Appointment Confirmation',

      html: `<p>Dear ${customerName},</p>
             <p>Your appointment has been confirmed successfully!</p>
             <p>Appointment Details:</p>
             <ul>
               <li>Appointment ID: ${appointment._id}</li>
               <li>Date: ${appointmentDate}</li>
               <li>Time: ${time}</li>
               <li>Location: ${location}</li>
               <li>Booked with: ${adminName}</li>
             </ul>
             <p>Please keep this information for future reference.</p>
             <p>Thank you for booking through NoQ!</p>
             <img src="cid:image1@company.com" alt="Example Image" style="width: 100%; max-width: 300px;">` ,

      attachments: [
        {
          filename: 'NoQ.png',
          path: path.join('Email', 'NoQ.png'), // Corrected path
          cid: 'image1@company.com'
        },
      ],
      
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send('Confirmation email sent');
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    res.status(500).send('Error sending confirmation email');
  }
});

module.exports = app;