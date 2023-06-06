import path from "path";
import { createCanvas, loadImage } from "canvas";
import express from "express";
import poolPromise from "../index";
import { User } from "../../types";
import mssql from "mssql";
import { validateMatricula } from "../util/functions";

const router: express.Router = express.Router();

// Get all registered students from the database.
router.get('/alumnos', async (req: express.Request, res: express.Response) => {
    try {
        const pool = await poolPromise;
        const request = pool!.request();
        const result = await request.execute('ObtenerTodosLosEstudiantes');
        
        if (result.recordset && result.recordset.length > 0) {
            // Create an array of users returned by the database.
            const users = result.recordset.map((user: any) => {
            return {
                matricula: user.Matricula,
                nombre: user.Nombre,
                apellidoPaterno: user.ApPaterno,
                apellidoMaterno: user.ApMaterno,
                correo: user.Correo,
                progreso: user.Progreso,
                estado: user.Estado
            } as User;
        });

        res.send({ state: "success", size: users.length, users: users });
        } else {
          res.send({ state: "success", size: 0, users: [] });
        }
      } catch (error) {
        console.error("Error retrieving students:".red, error);
        res.status(500).send({ state: "error", message: "An error occurred while retrieving students." });
      }
});

// Get a students certificate.
router.get('/certificado', async (req: express.Request, res: express.Response) => {
    const matricula: string = req.query.matricula as string;
    if (!matricula) return res.status(400).send({ state: "error", message: "Missing matricula parameter." });
    if (!validateMatricula(matricula)) return res.status(400).send({ state: "error", message: "matricula parameter is Invalid." });

    let result: mssql.IProcedureResult<any>;
    try {
        // Get students Diploma data from the database.
        const pool = await poolPromise;
        const request = pool!.request();
        request.input('Matricula', mssql.NChar, matricula);
        result = await request.execute('ObtenerCertificado');

        if (!result.recordset || result.recordset.length < 1) {
            return res.send({ state: "error", message: "Certificate not found." });
        }
    } catch (error) {
        console.error("Error retrieving certificate data:".red, error);
        return res.status(500).send({ state: "error", message: "An error occurred while retrieving certificate." });
    }
  
    // Create a canvas.
    const canvas = createCanvas(1920, 1080);
    const ctx = canvas.getContext('2d');

    const image = await loadImage(path.join(__dirname, '../assets/Diploma-barry-bel.png'));
    ctx.drawImage(image, 0, 0, 1920, 1080);

    // Set the font and text alignment properties.
    ctx.font = '42px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const nombre = result.recordset[0].Nombre;
    const campus = result.recordset[0].Campus;

    ctx.fillText(nombre, 940, 415);
    ctx.fillText(matricula.toUpperCase(), 940, 560);
    ctx.fillText(campus, 940, 710);

    // Send the image.
    const buffer = canvas.toBuffer();
    res.setHeader('Content-Type', 'image/jpeg');
    res.send(buffer);
});

// Get students data from the database.
router.get('/alumno', async (req: express.Request, res: express.Response) => {
    const matricula: string = req.query.matricula as string;
    if (!matricula) return res.status(400).send({ state: "error", message: "Missing matricula parameter." });
    if (!validateMatricula(matricula)) return res.status(400).send({ state: "error", message: "matricula parameter is Invalid." });

    let result: mssql.IProcedureResult<any>;
    try {
        // Get students data from the database.
        const pool = await poolPromise;
        const request = pool!.request();
        request.input('Matricula', mssql.NChar, matricula);
        result = await request.execute('ObtenerEstudiante');

        if (!result.recordset || result.recordset.length < 1) {
            return res.send({ state: "error", message: "Student not Found." });
        }
    } catch (error) {
        console.error("Error retrieving student data:".red, error);
        return res.status(500).send({ state: "error", message: "An error occurred while retrieving student." });
    }

    res.send({ state: "success", user: { 
        matricula: result.recordset[0].Matricula,
        nombre: result.recordset[0].Nombre,
        apellidoPaterno: result.recordset[0].ApPaterno,
        apellidoMaterno: result.recordset[0].ApMaterno,
        correo: result.recordset[0].Correo,
        campus: result.recordset[0].Campus,
        progreso: result.recordset[0].Progreso,
        estado: result.recordset[0].Estado
    } as User });
});

// Get data for all minigames for a student
router.get('/alumno/minijuegos', (req: express.Request, res: express.Response) => {
    res.send({ state: "success" });
});

// Update the students minigame registry with the new started minigame.
router.post('/alumno/startminigame', async (req: express.Request, res: express.Response) => {
    const { matricula } = req.body;
    const { minigameId } = req.body;
    if (!minigameId || !matricula) return res.status(400).send({ state: "error", message: "Missing parameters." });
    if (!validateMatricula(matricula)) return res.status(400).send({ state: "error", message: "matricula parameter is Invalid." });

    // Check if the student has started that minigame before. If not, add it to the registry as in-progress.
    try {
        const pool = await poolPromise;
        const request = pool!.request();
        request.input('Matricula', mssql.NChar, matricula);

        request.input('MinijuegoId', mssql.Int, parseInt(minigameId));
        await request.execute('ActualizarMinijuegoEmpezado');
    
        res.send({ state: "success", message: "Minigame started successfully." });
    } catch (error: any) {
        return res.status(500).send({ state: "error", error: error.originalError.message });
    }
});

// Update the students minigame registry with the finished minigame.
router.post('/alumno/finishminigame', async (req: express.Request, res: express.Response) => {
    // Get matricula and minigame id from post parameters.
    const { matricula } = req.body;
    const { minigameId } = req.body;
    if (!minigameId || !matricula) return res.status(400).send({ state: "error", message: "Missing parameters." });
    if (!validateMatricula(matricula)) return res.status(400).send({ state: "error", message: "matricula parameter is Invalid." });

    // Check if the student has started that minigame before. If not, return an error.
    let result: mssql.IProcedureResult<any>;
    try {
        const pool = await poolPromise;
        const requestUpdate = pool!.request();
        requestUpdate.input('MinijuegoId', mssql.Int, parseInt(minigameId));
        requestUpdate.input('Matricula', mssql.NChar, matricula);
        result = await requestUpdate.execute('ActualizarMinijuegoCompletado');
        
        res.send({ state: "success", message: "Minigame state has been changed to completed."})
    } catch (error: any) {
        return res.status(500).send({ state: "error", error: error.originalError.message });
    }
});

export default router;