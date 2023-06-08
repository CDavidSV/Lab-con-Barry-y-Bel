// MS SQL Config
const config = (sqlCredentials: any) => {
    return {
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
}

export default config;