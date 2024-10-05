const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const app = express();

let otpStore = {};
app.use(express.json());

app.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  const otp = crypto.randomInt(1000, 9999).toString();
  // const otp = "1000";

  otpStore[email] = {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  };

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"NoQ" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP Code',
    html: `
      <p>Your OTP is <strong>${otp}</strong>. It will expire in 5 minutes.</p>
      <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://firebasestorage.googleapis.com/v0/b/nowq-85c44.appspot.com/o/NoQ.png?alt=media&token=481c9686-4c68-4bb1-a381-d745db1a4586" alt="NoQ Logo" style="width: 100px; height: auto;" />
      </div>
      `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('OTP sent');
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).send('Error sending OTP');
  }
});

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
    delete otpStore[email];
  } else {
    res.status(400).send('Invalid OTP');
  }
});

app.post('/confirm-email', async (req, res) => {
  const { appointment, providerEmail } = req.body;

  try {
    if (!appointment || !providerEmail) {
      return res.status(400).json({ message: 'Appointment and provider email data are required' });
    }

    const { customerName, appointmentDate, time, location, adminName, email } = appointment;

    if (!email) {
      return res.status(400).json({ message: 'Customer email address is missing' });
    }

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailHTML = `
      <p>Dear ${customerName},</p>
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
      <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://firebasestorage.googleapis.com/v0/b/nowq-85c44.appspot.com/o/NoQ.png?alt=media&token=481c9686-4c68-4bb1-a381-d745db1a4586" alt="NoQ Logo" style="width: 100px; height: auto;" />
      </div>
      
    `;

    const customerMailOptions = {
      from: `"NoQ" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Appointment Confirmation',
      html: emailHTML,
    };

    const providerMailOptions = {
      from: `"NoQ" <${process.env.EMAIL_USER}>`,
      to: providerEmail,
      subject: 'New Appointment Booked',
      html: `
        <p>Dear ${adminName},</p>
        <p>A new appointment has been booked by ${customerName}.</p>
        <p>Appointment Details:</p>
        <ul>
          <li>Appointment ID: ${appointment._id}</li>
          <li>Date: ${appointmentDate}</li>
          <li>Time: ${time}</li>
          <li>Location: ${location}</li>
        </ul>
        <p>Please confirm the appointment from your dashboard.</p>
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://firebasestorage.googleapis.com/v0/b/nowq-85c44.appspot.com/o/NoQ.png?alt=media&token=481c9686-4c68-4bb1-a381-d745db1a4586" alt="NoQ Logo" style="width: 100px; height: auto;" />
        </div>
      `,
    };

    await transporter.sendMail(customerMailOptions);
    await transporter.sendMail(providerMailOptions);

    res.status(200).send('Confirmation email sent to both customer and provider');
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    res.status(500).send('Error sending confirmation email');
  }
});

module.exports = app;