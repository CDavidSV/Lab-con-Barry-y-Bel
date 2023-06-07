// MS SQL Config
const sqlCredentials = JSON.parse(process.env.SQL_SERVER_CREDENTIALS ?? "{}");
const config = {
    user: sqlCredentials.user,
    password: sqlCredentials.password,
    server: sqlCredentials.server,
    database: sqlCredentials.database,
    options: {
        trustServerCertificate: true,
        trustedconnection: true,
        enableArithAbort: true,
        instancename: "",
        encrypt: true 
    },
    port: sqlCredentials.port
}

export default config;