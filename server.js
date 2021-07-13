const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

//Load config file
dotenv.config({path: './config/config.env'});
//Connect to db
connectDB();

//Route files
const media = require('./routes/media');

const PORT = process.env.PORT || 8080;

//initialite express app
const app = express();

//
// Body parser
app.use(express.json());

//set static folder
app.use(express.static(path.join(__dirname,'static')));

//Mount routers
app.use('/api/media/', media);

//start server
const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));