import express from "express";
import passport from "passport";
import cookieParser from "cookie-parser";
import session from "express-session";
import colors from "colors";
import path from "path";

const secret = "O2TsCpfRNb9yhwPjFnLJ";

// Routes
import loginRoute from "./routes/login";
import alumnoRoute from "./routes/alumno";
import apiRoute from "./routes/api";

// Config
colors.enable();
const app = express();
const port = 3000;

const staticPath = path.join(__dirname, './public');
app.use(express.static(staticPath));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(secret));
app.use(session({
    secret: secret,
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Endpoints.
app.use('/login', loginRoute);
app.use('/alumno', alumnoRoute);
app.use('/api', apiRoute);

app.get('/', (req: express.Request, res: express.Response) => {
    // Send main page.
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/logout', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.isAuthenticated()) return next();

    res.send({ status: "failed", message: "Unauthorized" });
}, (req: express.Request, res: express.Response) => {
    // Clear session-related data on the server
    req.session.destroy((err) => {
        if (err) {
            res.status(500).send({ status: "failed", message: "Error clearing session" });
        } else {
            res.send({ status: "success", message: "Logout successful" });
        }
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`.green)
});