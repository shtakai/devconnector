require('dotenv-safe').config();

const mongoose = require('mongoose');
const express = require('express');

const app = express();

// DB config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log('MondoDB Connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send('waHello'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
