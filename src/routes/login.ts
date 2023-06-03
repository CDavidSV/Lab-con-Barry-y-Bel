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
    if (username === "maestro@mail.com" && password === "4321") {
        return done(null, { matricula: 'L01281809', nombre: "Maestro", apellidoPaterno: 'Primero', apellidoMaterno: 'Segundo', correo: 'maestro@mail.com' } as Maestro);
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
router.post('/', (req: express.Request, res: express.Response) => {
    passport.authenticate('local', (err: any, user: any, info: any) => {
        if (!user) {
            // Authentication failed
            return res.send({ status: 'failed', message: 'Correo o contraseña incorrectos' });
        }
        // Manually perform login
        req.logIn(user, (err) => {
            // User is authenticated and validated
            const { nombre, apellidoPaterno, apellidoMaterno } = user;
            return res.send({ status: 'success', nombre, apellidoPaterno, apellidoMaterno });
        });
    })(req, res);
});

export default router;