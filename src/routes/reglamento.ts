import path from "path";
import express from "express";

const router: express.Router = express.Router();

router.get('/', (req: express.Request, res: express.Response) => 

    res.sendFile(path.join(__dirname, '../public/reglamento.html'))
);

export default router;