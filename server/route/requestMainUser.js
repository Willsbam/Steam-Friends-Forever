const express= require('express');
const router =express.Router();
const dataHandler = require('../controllers/DataHandler');

router.get('/',dataHandler.requestMainUser);
module.exports = router;
