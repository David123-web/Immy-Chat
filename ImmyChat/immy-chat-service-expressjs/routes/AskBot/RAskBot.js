const express = require('express')
const askbot = require('./../../controllers/AskBot/CAskBot');
/*const middlewareController = require('./../../controllers/Middleware/CMiddleware');
const constant = require('../../common/Const');
*/
const router = express.Router()

router.post('/', askbot.hello)
router.post('/ask-opie', askbot.askOpie); //Sends message to Rasabot and returns an answer.
router.post('/ask-immy', askbot.askImmy); 
//router.post(constant.linkAskImmyMessage, middlewareController.verifyTokenInstructor, ChatBotController.askImmy); //Sends message to Rasabot and returns an answer.

module.exports = router