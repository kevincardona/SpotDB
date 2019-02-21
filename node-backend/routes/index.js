var router      = require('express').Router();
var spotify     = require('./spotify');
var user        = require('./user');
var util        = require('./util');
var tweets      = require('./tweets');

router.get('/', (req, res) => {
    res.send({success: 'true', message: 'Connected to SpotDB server.'})
});
router.get('/login', spotify.login);
router.post('/authorized', spotify.authorized);
router.get('/search', spotify.search);
router.get('/getaddress', util.getAddress); //Gets lat/lon in query and returns address
router.get('/getTweets', tweets.getTweets);

// Requires User to Be Logged In
router.get('/accountinfo', spotify.accountInfo)
router.get('/getHome', user.getHome);
router.post('/sethome', user.setHome);

module.exports = router;
