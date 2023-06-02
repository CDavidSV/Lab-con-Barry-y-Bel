import path from "path";
import express from "express";

const router: express.Router = express.Router();

// Receive credentials and log in.
router.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.isAuthenticated()) return next();

    res.redirect('/login');
}, (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, '../public/maestro.html'));
});

export default router;