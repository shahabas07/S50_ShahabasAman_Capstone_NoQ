const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const jwt = require("jsonwebtoken");
require('dotenv').config();
const ServiceProfile = require('./Schemas/profileSchema'); 
const sectionModal = require('./Schemas/availabilitySchema'); 
const API_URI = process.env.VITE_API_URI;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const generateToken = (user) => {
    return jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: "5h" });
}

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${API_URI}/auth/google/callback`,
    passReqToCallback: true
},
async function (request, accessToken, refreshToken, profile, done) {
    try {
        let profileDoc = await ServiceProfile.findOne({ email: profile.email });

        let userDoc;
        if (!profileDoc) {
            newSection = new sectionModal();
            await newSection.save();

            // console.log("---", newSection)

            userDoc = new ServiceProfile({
                username: profile.displayName.replace(/\s+/g, '').toLowerCase(), 
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

        // console.log("success")

        const token = generateToken(profileDoc);

        request.res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        
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
