import "dotenv/config";
import express from "express";
import jobsRouter from "./api/jobs";
import { connectDB } from "./infrastructure/db";
import jobApplicationRouter from "./api/jobApplication";
import cors from "cors";
import GlobalErrorHandlingMiddleware from "./api/middleware/global-error-handler";

const app = express();

// CORS configuration
const corsOptions = {
    origin: 'https://ai-job-portal-front-end-kasuni77.netlify.app',
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions)); // Apply CORS middleware first
app.use(express.json());

connectDB();

app.use("/jobs", jobsRouter);
app.use("/jobApplications", jobApplicationRouter);

app.use(GlobalErrorHandlingMiddleware);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}.`));