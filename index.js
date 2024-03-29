require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const router = require('./routes/index');

const app = express();
const API_BASE_PATH = process.env.API_BASE_PATH;
process.env.TZ = "Asia/Jakarta";

app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(cors({
    origin: "*",
    credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// err handler
app.use(API_BASE_PATH, router);

app.use((req, res, next) => {
    return res.status(404).json({
        status: 'NOT_FOUND',
        message: 'Resource Not Found',
        data: null
    });
});

app.use((err, req, res, next) => {
    return res.status(500).json({
        status: 'INTERNAL_SERVER_ERROR',
        message: err.message,
        data: null
    });
});

module.exports = app;