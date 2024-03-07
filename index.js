const express = require('express');
const dotenv=require('dotenv').config();

const route = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/', route);

app.listen(port);
