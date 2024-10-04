const express = require('express')

const awspolly = require('./../../controllers/AWSPolly/CAWSPolly'); 
/*const middlewareController = require('./../../controllers/Middleware/CMiddleware');
const constant = require('../../common/Const');
*/
const router = express.Router()

router.get('/get-voiceList/:LanguageCode', awspolly.getVoiceList)
router.get('/get-language', awspolly.getLanguageList)
router.post('/generate-audio', awspolly.generateAIAudio)

module.exports = router