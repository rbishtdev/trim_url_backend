import express from 'express';
import * as dotenv from 'dotenv';
import path from 'path';
import authRoutes from "./routes/auth.routes";
import cors from 'cors';
import urlRoutes from "./routes/url.routes";
import  './jobs/scheduler';
import cookieParser from 'cookie-parser';

// Load correct .env.development file based on NODE_ENV
dotenv.config({
    path: path.resolve(
        process.cwd(),
        process.env.NODE_ENV === 'production' ? '.env.development.production' : '.env.development.development'
    ),
});

const app = express();
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/url', urlRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT} in ${process.env.NODE_ENV} mode`);
});
