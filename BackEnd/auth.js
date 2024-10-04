const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt'); // Ensure you have bcrypt for password comparison if needed
require('dotenv').config();
const ServiceProfile = require('./Schemas/profileSchema'); 
const sectionModal = require('./Schemas/availabilitySchema'); 

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const generateToken = (user) => {
    return jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: "5h" }); // Adjusted to include username
}

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:2024/auth/google/callback",
    passReqToCallback: true
},
async function (request, accessToken, refreshToken, profile, done) {
    try {
        let profileDoc = await ServiceProfile.findOne({ email: profile.email });

        let userDoc;
        if (!profileDoc) {
            newSection = new sectionModal();
            await newSection.save();

            console.log("---", newSection)

            userDoc = new ServiceProfile({
                username: profile.displayName.replace(/\s+/g, '').toLowerCase(), // Create a username based on the display name
                name: profile.displayName,
                email: profile.email,
                avatar: profile._json.picture,
                section: newSection._id,
            });
            await userDoc.save();
            profileDoc = userDoc; 
        } else {
            profileDoc = await ServiceProfile.findOne({ email: profile.email });
        }

        console.log("success")

        // Generate token with the username
        const token = generateToken(profileDoc);

        // Set the cookie with the token
        console.log(request.res.cookie)
        request.res.cookie("token", token, {
            httpOnly: false,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Respond with token and username instead of the user document
        return done(null, { token, username: profileDoc.username });
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

module.exports = passport;
