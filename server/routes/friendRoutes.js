const express = require('express');

const { connectToFriend, displayAllFriends } = require('../controllers/friendController')


const router = express.Router();

router.post('/connect', connectToFriend);

router.get('/display', displayAllFriends);

module.exports = router;