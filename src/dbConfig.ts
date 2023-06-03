// MS SQL Config
const config = {
    user: "Viper",
    password: "1234",
    server: "VIPER-PC",
    database: "BarryDB",
    options: {
        trustServerCertificate: true,
        trustedconnection: true,
        enableArithAbort: true,
        instancename: "",
        encrypt: true 
    },
    port: 49693
}

export default config;