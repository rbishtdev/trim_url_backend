import express from 'express';
import * as dotenv from 'dotenv';
import path from 'path';
import authRoutes from "./routes/auth.routes";
import cors from 'cors';

// Load correct .env file based on NODE_ENV
dotenv.config({
    path: path.resolve(
        process.cwd(),
        process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
    ),
});

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT} in ${process.env.NODE_ENV} mode`);
});
