import config from "./dbConfig";
import mssql from "mssql";

const connectToDB = async () => {
    try {
        let pool = await mssql.connect(config(JSON.parse(process.env.SQL_SERVER_CREDENTIALS ?? "{}")));
        console.log("Connected to SQL Server...".green);

        return pool;
    } catch (error) {
        console.error(`Error while attempting to establish SQL connection. Error: ${error}`.red);
    }
}

export default connectToDB;