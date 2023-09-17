import express from "express";
import connectToDb from "./config/db.js";

// **********routes**************
import authRoutes from './routes/AuthRoutes.js';

const app = express();
app.use(express.json())

app.use('/', authRoutes);




connectToDb()
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log("Server Running on Port" + PORT))