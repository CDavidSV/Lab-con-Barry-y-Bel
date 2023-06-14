import dotenv from "dotenv";
import express from "express";
import passport from "passport";
import cookieParser from "cookie-parser";
import session from "express-session";
import colors from "colors";
import path from "path";
import connectToDB from "./dboperation";

// Routes
import loginRoute from "./routes/login";
import alumnoRoute from "./routes/alumno";
import maestroRoute from "./routes/maestro";
import apiRoute from "./routes/api";

// Config
dotenv.config();
colors.enable();
const app = express();
const port = 8080;
const secret = "O2TsCpfRNb9yhwPjFnLJ";

// Middleware.
const staticPath = path.join(__dirname, './public');
app.use(express.static(staticPath));
app.use('/alumno/TemplateData', express.static(path.join(__dirname, './public/TemplateData'), { 
    setHeaders: (res, path, stat) => {
      res.set('Content-Type', 'text/css');
    }
}));
app.use('/alumno/Build', express.static(path.join(__dirname, './public/Build'), { 
    setHeaders: (res, path, stat) => {
      res.set('Content-Type', 'application/javascript');
    }
}));
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
app.use('/maestro', maestroRoute);
app.use('/api', apiRoute);

// Connect to db.
const pool = connectToDB().then((pool) => pool);

// Display main page.
app.get('/', (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, './src/public/index.html'));
});

app.get('/nuestro_equipo', (req: express.Request, res: express.Response) => {
   res.sendFile(path.join(__dirname, '../src/public/equipo.html')); 
});

app.get('/reglamento', (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, '../src/public/reglamento.html'));
});

// Logout.
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

app.use((_, res) => res.redirect("/"));

export default pool;