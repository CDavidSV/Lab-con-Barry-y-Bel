import path from "path";
import express from "express";
import passport from "passport";
import { Strategy } from "passport-local";
import { Estudiante, Maestro } from "../../types";
import mssql from "mssql";
import poolPromise from "../index";



const router: express.Router = express.Router();

// Validate user login.
passport.use(new Strategy( async (username, password, done) => {
    const pool = await poolPromise;
    const requestAlumno = pool!.request();
    requestAlumno.input('email', mssql.NVarChar, username);
    requestAlumno.input('password', mssql.NVarChar, password);

    const result = await requestAlumno.execute('ObtenerDatoEstudiante');

    if (result.recordset.length < 1) {
        // Credentials are incorrect or user does not exist.
        return done(null, false);
    }

    return done(null, result.recordset[0] as Estudiante | Maestro);
}));

passport.serializeUser((user: any, done) => {
    done(null, user.Matricula);
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