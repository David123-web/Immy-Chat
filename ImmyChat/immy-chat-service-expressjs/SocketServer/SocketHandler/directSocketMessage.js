//import Conversation from '../models/conversation'
//import Message from '../models/message'
const chatUpdates = require('./updates/chat')

const directMessageHandler = async(socket, data) => {
	try {
		const { receiverUserId, content, senderUserId } = data

	} catch(err) {
		console.log(err)
	}
}

module.exports = directMessageHandler