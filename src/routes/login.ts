import path from "path";
import express from "express";
import passport from "passport";
import { Strategy } from "passport-local";
import { Estudiante, Maestro } from "../../types";

const router: express.Router = express.Router();

// Validate user login.
passport.use(new Strategy((username, password, done) => {
    if (username === "testuser@testemail.com" && password === "1234") {
        return done(null, { matricula: 'A00123456', nombre: "Carlos", apellidoPaterno: 'Sandoval', apellidoMaterno: 'Vargas', correo: 'A00123456@testemail.com', progreso: 60 } as Estudiante);
    }
    // Credentials are incorrect or user does not exist.
    done(null, false);
}));

passport.serializeUser((user: any, done) => {
    done(null, user.matricula);
});

passport.deserializeUser((matricula, done) => {
    done(null, { matricula: 'A00123456', nombre: "Carlos", apellidoPaterno: 'Sandoval', apellidoMaterno: 'Vargas', correo: 'A00123456@testemail.com', progreso: 60 });
});

// Send Login page.
router.get('/', (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Receive credentials and log in.
router.post('/', passport.authenticate('local'), (req, res) => {
    if (req.isAuthenticated()) {
        // User is authenticated and validated
        res.redirect('/alumno');
    } else {
        // Authentication failed
        res.send({ status: 'failed', title: 'Incorrect credentials' });
    }

    console.log(req.user);
  });

export default router;