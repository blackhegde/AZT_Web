import express from 'express';
import pkg from 'pg';
import { sequelize } from './config/db.js';
import Company from './models/Company.js';
const { Pool } = pkg;

const app = express();
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '1212',
    port: 5432,
});

app.get("/test", async (req, res) => {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]);
});

await sequelize.sync();
app.post("/companies", async (req, res) => {
    try {
        const company = await Company.create(req.body);
        res.status(201).json(company);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});