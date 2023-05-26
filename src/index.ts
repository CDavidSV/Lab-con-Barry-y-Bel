import express from "express";
import colors from "colors";
import path from "path";

// Routes
import loginRoute from "./routes/login";

// Config
colors.enable();
const app = express();
const port = 3000;

const staticPath = path.join(__dirname, './public');
app.use(express.static(staticPath));
app.use(express.json());
app.use('/login', loginRoute);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`.green)
});