const passport = require("passport");
require("./db");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.serializeUser((user, done) => {
    done(null, user);
})
passport.deserializeUser(function (user, done) {
    done(null, user);
});
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true

},

    async function (request, response, accessToken, refreshToken, profile, done) {

        // if (profile._json.domain !== 'akgec.ac.in') {
        //     done(new Error("Wrong domain!"));
        // }

        console.log(profile);
        let newUser = {};
        let userProfileData = {
            username: profile.displayName,
            googleid: profile.id,
            pic: profile.photos[0].value,
            email: profile.emails[0].value

        };



        // console.log("userProfileData" , userProfileData)
        let userExist = await User.findOne({ googleid: profile.id });
        console.log("userExist", userExist);
        if (userExist != null) {
            newUser = userExist;
        }
        else {
            newUser = await new Promise((resolve, reject) => {
                User.create(userProfileData, function (err, newlyCreatedUser) {
                    if (err) {
                        console.log(err);
                    } else {
                        resolve(newlyCreatedUser);
                        console.log("newlyCreatedUser", newlyCreatedUser)
                    }
                });
            });
        }
       return done(null, newUser);
    }
));
