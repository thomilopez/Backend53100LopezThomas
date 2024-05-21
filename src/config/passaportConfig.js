import passport from "passport";
import local from "passport-local";
import userModel from "../models/usersModel.js";
import { createHash, isValidPassword } from "../utils.js";
import GitHubStrategy from "passport-github2";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use(
        "register",
        new LocalStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;

            try {
            const user = await userModel.findOne({ email: username });
            if (user) {
                console.log("Usuario existente");
                return done(null, false); 
            }

            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password), 
            };

            // Guardar el usuario
            const result = await userModel.create(newUser);
            return done(null, result); 
            } catch (error) {
            return done(error); 
            }
        }
        )
    );


passport.use(
    "login",
        new LocalStrategy(
        { usernameField: "email" },
        async (username, password, done) => {
            try {
            const user = await userModel.findOne({ email: username });
            if (!user) return done(null, false);
            const valid = isValidPassword(user, password);
            if (!valid) return done(null, false);

            return done(null, user);
            } catch (error) {
            return done(error);
            }
        }
        )
    );

    passport.use(
    "github",
        new GitHubStrategy(
        {
            clientID: "Iv23lio7O397p8vdBPXu", 
            clientSecret: "f4d92c1eba940055b887e56774f6ea5b473ea066", 
            callbackURL: "http://localhost:8080/api/sessions/githubcallback", 
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
            console.log(profile); 
            const user = await userModel.findOne({
                email: profile._json.email,
            });
            if (!user) {
                const newUser = {
                first_name: profile._json.name,
                last_name: "",
                age: 20,
                email: profile._json.email,
                password: "",
                };
                let createdUser = await userModel.create(newUser);
                done(null, createdUser);
            } else {
                done(null, user);
            }
            } catch (error) {
            return done(error);
            }
        }
        )
    );


  //Serializar y deserializar usuario

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
        try {
        let user = await userModel.findById(id);
        done(null, user);
        } catch (error) {
        done(error);
        }
    });
    };





export default initializePassport;