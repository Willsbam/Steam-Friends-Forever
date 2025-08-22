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
        'Access-Control-Allow-Origin': '*'
    });
    const mainUserJSON=activeSessions.get(parseInt(req.query.sessionID));




    dataHandler.batchRequestFriends(req,res,mainUserJSON);
    
   

    // let counter = 0;
    // const interval = setInterval(() => {
    //     counter++;
    //     const data = {
    //         type: 'test',
    //         message: `Hello from server - ${counter}`,
    //         timestamp: new Date().toISOString()
    //     };
    //     res.write(`data: ${JSON.stringify(data)}\n\n`);

    //     // Stop after 10 messages for testing
    //     if (counter >= 10) {
    //         clearInterval(interval);
    //         res.write(`data: ${JSON.stringify({ type: 'complete', message: 'Stream ended' })}\n\n`);
    //         res.end();
    //     }
    // }, 2000);


    // Clean up when client disconnects
    req.on('close', () => {
        //clearInterval(interval);
        res.end();
    });
});



module.exports = router;
