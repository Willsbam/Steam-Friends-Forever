const express= require('express');
const router =express.Router();
const dataHandler = require('../controllers/DataHandler');

router.get('/',dataHandler.requestFriends);
module.exports = router;
