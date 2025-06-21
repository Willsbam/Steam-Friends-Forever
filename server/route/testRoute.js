const express= require('express');
const router =express.Router();
const controller = require('../controllers/RequestsController');

router.get('/',controller.requestFriends);
module.exports = router;
