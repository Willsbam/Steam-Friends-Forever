const express= require('express');
const router =express.Router();
const dataHandler = require('../controllers/DataHandler');

const activeSessions = new Map();
let latestSessionID=0;


//this router should send the complex data in JSON Format
router.post('/start', (req, res) => {
    const mainJSON=req.body.data.mainUser;
    activeSessions.set(latestSessionID,mainJSON);
    console.log(`Created session ${latestSessionID} for user ${mainJSON.username}`);

    
    res.json({id: latestSessionID});
    latestSessionID++;
});

router.get('/', (req, res) => {
    // Set SSE headers
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': 'https://steam-friends-forever-uf6oi.ondigitalocean.app',
        'Access-Control-Allow-Credentials': 'false',
        "X-Accel-Buffering": "no",
        'Content-Encoding':'none'
    });
      res.flushHeaders();

    const mainUserJSON=activeSessions.get(parseInt(req.query.sessionID));




    dataHandler.batchRequestFriends(req,res,mainUserJSON);
    

    


    // Clean up when client disconnects
    req.on('close', () => {
        //clearInterval(interval);
        res.end();
    });
});



module.exports = router;
