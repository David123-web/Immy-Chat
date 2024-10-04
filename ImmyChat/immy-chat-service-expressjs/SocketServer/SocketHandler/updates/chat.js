//import Conversation from '../../models/conversation'
const serverStore = require('../../ServerStore')

const updateChatHistory = async(conversationId, toSpecifiedSocketId = null) => {
	/*const conversation = await Conversation.findById(conversationId).populate({
		path: 'messages',
		model: 'Message',
		populate: {
			path: 'author',
			model: 'User',
			select: 'firstName lastName _id image'
		}
	})

	if (conversation) {
	    const io = serverStore.getSocketServerInstance();

	    if (toSpecifiedSocketId) {
	      // initial update of chat history
			console.log('toSpecifiedSocketId',toSpecifiedSocketId)
			const activeConnections = serverStore.getActiveConnections(toSpecifiedSocketId.toString())
			activeConnections.forEach(socketId => {
				io.to(socketId).emit('direct-chat-history', {
					messages: conversation.messages,
					participants: conversation.participants
				})
			})
			return
	    }

	    // check if users of this conversation are online
	    // if yes emit to them update of messages

	    conversation.participants.forEach((userId) => {
	      const activeConnections = serverStore.getActiveConnections(
	        userId.toString()
	      );

	      activeConnections.forEach((socketId) => {
	        io.to(socketId).emit("direct-chat-history", {
	          messages: conversation.messages,
	          participants: conversation.participants,
	        });
	      });
	    });
	  }*/
}

module.exports = { updateChatHistory }