
const express = require('express');
const { initializeFirebaseApp, getFirebaseApp } = require("./firebase_config")


const app = express();


var cors = require('cors');
app.use(cors());

app.use(express.json());

const PORT = process.env.PORT || 8080;


const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


// Use your routes after the server starts
const userRoutes = require('./routes/user');

app.use('/api', userRoutes);



