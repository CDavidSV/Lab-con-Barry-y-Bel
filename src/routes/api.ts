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
        // Get students data from the database.
        const pool = await poolPromise;
        const request = pool!.request();
        const result = await request.execute('ObtenerTodosLosEstudiantes');

        const minigamesRequest = pool!.request();
        const minigames = await minigamesRequest.execute('ObtenerCatalogoMinijuegos');

        if (!result.recordset || result.recordset.length < 1) {
            res.send({ status: "success", size: 0, users: [] });
        }
        const users: User[] = [];
        result.recordset.forEach((student) => {
            const progressPercentage = Math.floor(student.Progreso / minigames.recordset.length * 100);
            // Create an array of users returned by the database.
            users.push({
                    matricula: student.Matricula,
                    nombre: student.Nombre,
                    apellidoPaterno: student.ApPaterno,
                    apellidoMaterno: student.ApMaterno,
                    correo: student.Correo,
                    progreso: progressPercentage,
                    estado: student.Estado
                } as User
            );
        });
        res.send({ status: "success", size: users.length, users: users });
      } catch (error) {
        console.error("Error retrieving students:".red, error);
        res.status(500).send({ status: "error", message: "An error occurred while retrieving students." });
      }
});

// Get a students certificate.
router.get('/certificado', async (req: express.Request, res: express.Response) => {
    const matricula: string = req.query.matricula as string;
    if (!matricula) return res.status(400).send({ status: "error", message: "Missing matricula parameter." });
    if (!validateMatricula(matricula)) return res.status(400).send({ status: "error", message: "matricula parameter is Invalid." });

    let result: mssql.IProcedureResult<any>;
    try {
        // Get students Diploma data from the database.
        const pool = await poolPromise;
        const request = pool!.request();
        request.input('Matricula', mssql.NChar, matricula);
        result = await request.execute('ObtenerCertificado');

        if (!result.recordset || result.recordset.length < 1) {
            return res.send({ status: "error", message: "Certificate not found." });
        }
    } catch (error) {
        console.error("Error retrieving certificate data:".red, error);
        return res.status(500).send({ status: "error", message: "An error occurred while retrieving certificate." });
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
    if (!matricula) return res.status(400).send({ status: "error", message: "Missing matricula parameter." });
    if (!validateMatricula(matricula)) return res.status(400).send({ status: "error", message: "matricula parameter is Invalid." });

    let result: mssql.IProcedureResult<any>;
    let minigames: mssql.IProcedureResult<any>;
    try {
        // Get students data from the database.
        const pool = await poolPromise;
        const request = pool!.request();
        request.input('Matricula', mssql.NChar, matricula);
        result = await request.execute('ObtenerEstudiante');
        
        const minigamesRequest = pool!.request();
        minigames = await minigamesRequest.execute('ObtenerCatalogoMinijuegos');

        if (!result.recordset || result.recordset.length < 1) {
            return res.send({ status: "error", message: "Student not Found." });
        }
    } catch (error) {
        console.error("Error retrieving student data:".red, error);
        return res.status(500).send({ status: "error", message: "An error occurred while retrieving student." });
    }

    const progressPercentage = Math.floor(result.recordset[0].Progreso / minigames.recordset.length * 100);

    res.send({ status: "success", user: { 
        matricula: result.recordset[0].Matricula,
        nombre: result.recordset[0].Nombre,
        apellidoPaterno: result.recordset[0].ApPaterno,
        apellidoMaterno: result.recordset[0].ApMaterno,
        correo: result.recordset[0].Correo,
        campus: result.recordset[0].Campus,
        progreso: progressPercentage,
        estado: result.recordset[0].Estado
    } as User });
});

// Get data for all minigames for a student
router.get('/alumno/minijuegos', async (req: express.Request, res: express.Response) => {
    const matricula: string = req.query.matricula as string;
    if (!matricula) return res.status(400).send({ status: "error", message: "Missing matricula parameter." });
    if (!validateMatricula(matricula)) return res.status(400).send({ status: "error", message: "matricula parameter is Invalid." });

    try {
        // Get students data from the database.
        const pool = await poolPromise;
        const request = pool!.request();
        request.input('Matricula', mssql.NChar, matricula);
        const result = await request.execute('ObtenerMinijuegosPorEstudiante');

        if (!result.recordset || result.recordset.length < 1) {
            return res.send({ status: "error", message: "Student not Found." });
        }

        res.send({ status: "success", minigames: result.recordset });
        
    } catch (error) {
        console.error("Error retrieving student data:".red, error);
        return res.status(500).send({ status: "error", message: "An error occurred while retrieving student." });
    }
});

// Update the students minigame registry with the new started minigame.
router.post('/alumno/comenzominijuego', async (req: express.Request, res: express.Response) => {
    const { matricula, minigameId } = req.body;
    if (!minigameId || !matricula) {
      return res.status(400).send({ status: "error", message: "Missing parameters." });
    }
    if (!validateMatricula(matricula)) {
      return res.status(400).send({ status: "error", message: "matricula is Invalid." });
    }

    // Check if the student has started that minigame before. If not, add it to the registry as in-progress.
    try {
        const pool = await poolPromise;

        const requestStudent = pool!.request();
        const requestMinigame = pool!.request();
        requestStudent.input('Matricula', mssql.NChar, matricula);
        requestMinigame.input('MinijuegoId', mssql.Int, parseInt(minigameId));

        const [resultStudent, resultMinigame] = await Promise.all([
            requestStudent.execute('ObtenerEstudiante'),
            requestMinigame.execute('ObtenerMinijuego')
        ]);

        if (resultStudent.recordset.length < 1) {
            return res.status(400).send({ status: "error", message: "Student not Found." });
        } else if (resultMinigame.recordset.length < 1) {
            return res.status(400).send({ status: "error", message: "Minigame not Found." });
        }

        const request = pool!.request();
        request.input('Matricula', mssql.NChar, matricula);
        request.input('MinijuegoId', mssql.Int, parseInt(minigameId));
        await request.execute('ActualizarMinijuegoEmpezado');
    
        res.send({ status: "success", message: "Minigame started successfully." });
    } catch (error: any) {
        return res.status(500).send({ status: "error", message: "An error occurred while updating minigame status.", error: error.originalError });
    }
});

// Update the students minigame registry with the finished minigame.
router.post('/alumno/terminominijuego', async (req: express.Request, res: express.Response) => {
    // Get matricula and minigame id from post parameters.
    const { matricula, minigameId } = req.body;
    if (!minigameId || !matricula) {
      return res.status(400).send({ status: "error", message: "Missing parameters." });
    }
    if (!validateMatricula(matricula)) {
      return res.status(400).send({ status: "error", message: "matricula is Invalid." });
    }
    // Check if the student has started that minigame before. If not, return an error.
    try {
        const pool = await poolPromise;

        const requestStudent = pool!.request();
        const requestMinigame = pool!.request();
        requestStudent.input('Matricula', mssql.NChar, matricula);
        requestMinigame.input('MinijuegoId', mssql.Int, parseInt(minigameId));

        const [resultStudent, resultMinigame] = await Promise.all([
            requestStudent.execute('ObtenerEstudiante'),
            requestMinigame.execute('ObtenerMinijuego')
        ]);

        if (resultStudent.recordset.length < 1) {
            return res.status(400).send({ status: "error", message: "Student not Found." });
        } else if (resultMinigame.recordset.length < 1) {
            return res.status(400).send({ status: "error", message: "Minigame not Found." });
        }

        const request = pool!.request();
        request.input('Matricula', mssql.NChar, matricula);
        request.input('MinijuegoId', mssql.Int, parseInt(minigameId));
        const result = await request.execute('ActualizarMinijuegoCompletado');

        if (result.rowsAffected.length < 1) {
            return res.status(400).send({ status: "error", message: "The student hasn't started that minigame." });
        }
            
        res.send({ status: "success", message: "Minigame status has been changed to completed."})
    } catch (error: any) {
        return res.status(500).send({ status: "error", message: "An error occurred while updating minigame status.", error: error.originalError });
    }
});

export default router;