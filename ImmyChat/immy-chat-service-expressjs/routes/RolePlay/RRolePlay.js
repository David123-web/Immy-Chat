const express = require('express')

const { RolePlayController } = require('../../controllers/RolePlay/CRolePlay.js');
const router = express.Router()

router.post('/post-lesson', RolePlayController.postRolePlayLesson)

module.exports = router