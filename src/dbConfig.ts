// MS SQL Config
const config = {
    user: "adminlab",
    password: "Tecate00.",
    server: "lab-barry-bel.database.windows.net",
    database: "BarryDB",
    options: {
        trustServerCertificate: true,
        trustedconnection: true,
        enableArithAbort: true,
        instancename: "",
        encrypt: true 
    },
    port: 1433
}

export default config;