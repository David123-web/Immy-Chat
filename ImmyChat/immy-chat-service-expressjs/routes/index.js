var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    console.log('reached!')
    res.send('Welcome!')
})

module.exports = router;
