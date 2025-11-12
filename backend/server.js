const express = require('express');
const mongoose = require('mongoose');
const Companies = require('./models/Company');
const cors = require('cors')
require('dotenv').config();
const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.FRONTED_URL,
    optionsSuccessStatus: 200 
}))
const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB connection error:", err));


app.post('/companies', async (req, res) => {
    try {
        const company = new Companies(req.body);
        await company.save();
        res.status(201).json(company);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

app.get('/api/companies', async (req, res) => {
    try {
        const companies = await Companies.find();
        res.status(200).json(companies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

app.listen(3000, () => console.log('Server is running on port 3000'));