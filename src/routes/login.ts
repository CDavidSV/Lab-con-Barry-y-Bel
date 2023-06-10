import path from "path";
import express from "express";
import passport, { use } from "passport";
import { Strategy } from "passport-local";
import { User } from "../../types";
import mssql from "mssql";
import poolPromise from "../index";

const router: express.Router = express.Router();

// Validate user login.
passport.use(new Strategy( async (username, password, done) => {
    const pool = await poolPromise;
    const request = pool!.request();
    request.input('email', mssql.NVarChar, username);
    request.input('password', mssql.NVarChar, password);

    try {
        const result = await request.execute('ObtenerDatosUsuario');
        if (result.recordset.length < 1) {
            // User does not exist.
            return done(null, false);
        }

        // Credentials are correct.
        const user = result.recordset[0];
        if (username.toLowerCase() === user.Correo.toLowerCase() && password === user.CodigoAcceso) {
            const minigamesRequest = pool!.request();
            const minigames = await minigamesRequest.execute('ObtenerCatalogoMinijuegos');
            const progressPercentage = Math.floor(result.recordset[0].Progreso / minigames.recordset.length * 100);
            const finalUser = { 
                matricula: user.Matricula, 
                nombre: user.Nombre, 
                apellidoPaterno: user.ApPaterno, 
                apellidoMaterno: user.ApMaterno, 
                correo: user.Correo, 
                campus: user.Campus,
                progreso: progressPercentage,
                estado: user.Estado
            } as User;

            done(null, finalUser);
        } else {
            // Credentials are incorrect.
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
}));

passport.serializeUser((user: any, done) => {
    done(null, user.matricula);
});

passport.deserializeUser(async (matricula, done) => {
    const pool = await poolPromise;
    const request = pool!.request();
    request.input('id', mssql.NVarChar, matricula);

    const result = await request.execute('ObtenerDatosUsuarioConId');
    const user = result.recordset[0];

    try {
        const minigamesRequest = pool!.request();
        const minigames = await minigamesRequest.execute('ObtenerCatalogoMinijuegos');
        const progressPercentage = Math.floor(result.recordset[0].Progreso / minigames.recordset.length * 100);
        const finalUser = { 
            matricula: user.Matricula, 
            nombre: user.Nombre, 
            apellidoPaterno: user.ApPaterno, 
            apellidoMaterno: user.ApMaterno, 
            correo: user.Correo, 
            campus: user.Campus,
            progreso: progressPercentage,
            estado: user.Estado
        } as User;
        done(null, finalUser);
    } catch (error) {
        return done(error, false);
    }
});

// Send Login page.
router.get('/', (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Receive credentials and log in.
router.post('/', (req: express.Request, res: express.Response) => {
    passport.authenticate('local', (err: any, user: User, info: any) => {
        if (!user) {
            // Authentication failed
            return res.send({ status: 'failed', message: 'Correo o contraseña incorrectos' });
        }
        // Manually perform login
        req.logIn(user, (err) => {
            // Check if the user is of type Maestro or Estudiante
            if (user.matricula.toLowerCase().startsWith('l0')) {
                // Maestro
                return res.status(200).send({ status: 'success', user: user as User });
            }
            // Estudiante
            return res.status(200).send({ status: 'success', user: user as User });
        });
    })(req, res);
});

export default router;