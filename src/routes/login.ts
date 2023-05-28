import path from "path";
import express from "express";
import passport from "passport";
import { Strategy } from "passport-local";

const router: express.Router = express.Router();

// Validate user login.
passport.use(new Strategy((username, password, done) => {
    // Find the user
    if (username === "testuser@testemail.com" && password === "1234") {
        return done(null, { id: 1, name: "Carlos" });
    }
    // Credentials are incorrect or user does not exist.
    done(null, false);
}));

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    done(null, { id: 1, name: "Carlos" });
});

// Send Login page.
router.get('/', (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Receive credentials and log in.
router.post('/', passport.authenticate('local', {
    successRedirect: "/",
    failureRedirect: "/login"
}));

export default router;