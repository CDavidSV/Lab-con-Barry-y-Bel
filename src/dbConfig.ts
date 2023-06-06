import dotenv from 'dotenv';

dotenv.config();
// MS SQL Config
const PORT = Number(process.env.DB_PORT ?? 1433);
const config = {
    user: process.env.DB_USER ?? "",
    password: process.env.DB_PASSWORD ?? "",
    server: process.env.DB_SERVER ?? "",
    database: process.env.DB_DATABASE ?? "",
    options: {
        trustServerCertificate: true,
        trustedconnection: true,
        enableArithAbort: true,
        instancename: "",
        encrypt: true 
    },
    port: PORT
}

export default config;