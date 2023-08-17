import express from "express";
import mysql from "mysql";
import dotenv from "dotenv";
import leadMasterRoutes from "./routes/lead_master_routes.js";
import customerEmergencyRoutes from "./routes/customer_emergency_routes.js";

const app = express();
app.use(express.json());
dotenv.config();
app.use("/api/lead_master", leadMasterRoutes);
app.use("/api/customer_emergency", customerEmergencyRoutes);

const PORT = process.env.PORT;

export const dbMySQL = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
});

dbMySQL.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL database: ", err);
        process.exit(1);
    }
    console.log("Connected to MySQL database");

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
