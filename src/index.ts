import express from 'express';
import * as dotenv from 'dotenv';
import path from 'path';

// Load correct .env file based on NODE_ENV
dotenv.config({
    path: path.resolve(
        process.cwd(),
        process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
    ),
});

const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (_req, res) => {
    res.send(`Hello from ${process.env.NODE_ENV} mode!`);
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT} in ${process.env.NODE_ENV} mode`);
});
