import path from "path";
import express from "express";

const router: express.Router = express.Router();

// Retorna todos los alumnos registrados. Pide un limite.
router.get('/alumnos', (req: express.Request, res: express.Response) => {
    res.send({ state: "success" });
});

// Retorna los datos del certificado. Requiere la matrícula del alumno.
router.get('/certificado', (req: express.Request, res: express.Response) => {
    res.send({ state: "success" });
});

// Retorna los datos de un alumno. Requiere la matrícula del alumno.
router.post('/alumno', (req: express.Request, res: express.Response) => {
    res.send({ state: "success" });
});

// Retorna los datos de todos los minujuegos para ese alumno. Requiere la matrícula del alumno.
router.get('/alumno/minijuegos', (req: express.Request, res: express.Response) => {
    res.send({ state: "success" });
});

// Crea un nuevo certificado para un alumno. Requiere la matrícula del alumno.
router.post('/certificado/create', (req: express.Request, res: express.Response) => {
    res.send({ state: "success" });
});

// Actualiza el estado de el alumno. Requiere el nuevo estado y la matrícula del alumno.
router.post('/updatealumno/state', (req: express.Request, res: express.Response) => {
    res.send({ state: "success" });
});

// Actualiza el progreso general de un alumno. Requiere el valor nuevo de progreso y la matrícula del alumno.
router.post('/updatealumno/progress', (req: express.Request, res: express.Response) => {
    res.send({ state: "success" });
});

// Atualiza el estado de un minijuego para un alumno. Requiere el id del alumno, el id para el minijuego y el estado.
router.post('/updateminijuegos/state', (req: express.Request, res: express.Response) => {
    res.send({ state: "success" });
});

// Crea los registros de los minijuegos para un usuario en particular. Requiere la matrícula del alumno.
router.post('/updateminijuegos/create', (req: express.Request, res: express.Response) => {
    res.send({ state: "success" });
});

export default router;
