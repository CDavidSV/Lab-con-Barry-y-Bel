import express from "express";
import passport from "passport";
import cookieParser from "cookie-parser";
import session from "express-session";
import colors from "colors";
import path from "path";

const secret = "O2TsCpfRNb9yhwPjFnLJ";

// Routes
import loginRoute from "./routes/login";

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

app.get('/', (req: express.Request, res: express.Response) => {
    // Send main page.
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`.green)
});