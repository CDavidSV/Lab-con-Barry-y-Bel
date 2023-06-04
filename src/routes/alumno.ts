import path from "path";
import express from "express";
import { User } from "../../types";


const router: express.Router = express.Router();
// Receive credentials and log in.
router.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.isAuthenticated()) return next();

    res.redirect('/login');
}, (req: express.Request, res: express.Response) => {
    const user = req.user as User;
    if (user.matricula?.toLowerCase().startsWith('l0')) {
        return res.redirect('/maestro');
    }

    res.sendFile(path.join(__dirname, '../public/alumno.html'));
});

export default router;