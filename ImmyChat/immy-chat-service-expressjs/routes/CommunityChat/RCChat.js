const express = require('express')

const commchat = require('./../../controllers/CommunityChat/CCChat');
const router = express.Router()

router.post('/invite-friend', commchat.inviteFriend)
router.post('/accept-invitation', commchat.acceptInvitation)
router.post('/reject-invitation', commchat.rejectInvitation)

module.exports = router