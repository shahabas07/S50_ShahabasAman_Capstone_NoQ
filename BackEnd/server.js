const express = require("express");
const app = express();
require("dotenv").config();
const session = require("express-session");
const cors = require("cors");
const port = process.env.PORT || 2024;
const connect = require("./config/connect");
const serviceRoute = require("./route/serviceRoute");
const profileRoute = require("./route/profileRoute");
const appointmentRoute = require("./route/appointmentRoute");
const sectionRoute = require("./route/sectionRoute");
const reviewRoute = require("./route/reviewRoute");
const Email = require("./Email/email");
const disabledDateRoutes = require('./route/disabledDateRoute');
const passport = require("passport");
require('./auth');

// Connect to the database
connect();

// CORS setup, allowing credentials
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true
}));

// JSON parsing middleware
app.use(express.json());

// Session configuration (ensure this comes before passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultsecret", // Prefer environment variable
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: false,
    }
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Health check endpoint
app.get("/ping", (req, res) => {
  res.send("pong");
});

// Google OAuth routes
app.get('/auth/google', 
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

// app.get('/auth/google/callback',
//   passport.authenticate('google', {
//     successRedirect: `http://localhost:5173/${req.name}`,
//     failureRedirect: 'http://localhost:5173/signin'
//   })
// );

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/sign-in' }),
  (req, res) => {
    // Assuming req.user contains the authenticated user's information
    const userName = req.user.username; // Change this according to how the user information is stored
    console.log(req.user)
    res.redirect(`http://localhost:5173/profile/${userName}`);
  }
);


app.get("/auth/failure", (req, res) => {
  res.send('Signup failed');
});

// Define application routes
app.use("/service", serviceRoute);
app.use("/profile", profileRoute);
app.use("/appointment", appointmentRoute);
app.use("/section", sectionRoute);
app.use("/review", reviewRoute);
app.use("/mail", Email);
app.use('/disabled-dates', disabledDateRoutes);

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running on PORT: ${port}`);
});

module.exports = app;
