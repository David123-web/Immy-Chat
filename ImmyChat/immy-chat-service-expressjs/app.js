const { registerSocketServer } = require('./SocketServer/SocketServer')
const {connectMongoDB} = require('./db/index')
const bodyParser = require('body-parser')
const express = require('express')
const http = require('http')
const cors = require('cors')
const app = express()
require('dotenv').config()

app.use(cors())
app.use(express.static(__dirname + '/views')); // html
app.use(express.static(__dirname + '/public')); // js, css, images
app.use(bodyParser.json())

var indexRouter = require('./routes/index')
var pollyRouter = require('./routes/AWSPolly/RAWSPolly')
var AskBotRouter = require('./routes/AskBot/RAskBot')
var communityChat = require('./routes/CommunityChat/RCChat')
var rolePlay = require('./routes/RolePlay/RRolePlay')

app.use('/service', indexRouter)
app.use('/service/aws-polly', pollyRouter)
app.use('/service/ask-bot', AskBotRouter)
app.use('/service/community-chat', communityChat)
app.use('/service/role-play', rolePlay)

const PORT = process.env.PORT || 8080
const server = http.createServer(app)
registerSocketServer(server)

server.listen(PORT, async () => {
	await connectMongoDB();
	console.log(PORT)
})