//import Conversation from '../models/conversation'
const chatUpdates = require('./updates/chat')

const directChatHistoryHandler = async(socket, data) => {
	try {

		const { senderUserId, receiverUserId } = data
		/*const conversation = await Conversation.findOne({
			participants: { $all: [senderUserId, receiverUserId] },
			type: 'DIRECT'
		})
		if (conversation) {
			//console.log(senderUserId)
			chatUpdates.updateChatHistory(conversation._id, senderUserId)
		}*/
	} catch(err) {
		console.log(err)
	}
}

module.exports = directChatHistoryHandler