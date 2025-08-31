const express = require('express');
const app = express();
const path = require('path')
const cors = require('cors');
require('dotenv').config();

// Add proper CORS handling
app.use(cors({
  origin: ['https://steam-friends-forever-uf6oi.ondigitalocean.app/','http://localhost:8080/'],
  credentials: false,
  methods: ['GET', 'POST']
}));

// let clientBuildPath='./build';
let clientBuildPath='../client/build';


app.use(express.static(path.join(__dirname, clientBuildPath)));
app.use(express.json());

app.use(`/requestMainUser`, require('./route/requestMainUser'));
app.use(`/requestFriends`, require('./route/requestSortedFriends'));


app.use('/friendBatches', require('./route/sendBatchedFriends'));
// This code makes sure that any request that does not matches a static file

// This code makes sure that any request that does not matches a static file
// in the build folder, will just serve index.html. Client side routing is
// going to make sure that the correct content will be loaded.
app.use((req, res, next) => {
    if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
        next();
    } else {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        res.sendFile(path.join(__dirname, clientBuildPath, 'index.html'));
    }
});


// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});


//This starts loading the CSV once the server boots up
const game = require("./model/Game");
game.readGameCSV().catch(err => {
    console.error("Error reading game CSV:", err);
});