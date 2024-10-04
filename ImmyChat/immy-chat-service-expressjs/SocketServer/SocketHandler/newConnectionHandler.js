const friendsUpdate = require('../SocketHandler/updates/friends')
const serverStore = require('../ServerStore')

const newConnectionHandler = async (socket, io) => {
	console.log(socket.handshake.auth?.user)
	if (socket.handshake.auth?.user) {
		serverStore.addNewConnectedUser({
			socketId: socket.id,
			userId: socket.handshake.auth?.user
		})
		friendsUpdate.updateFriendsPendingInvitations(socket.handshake.auth?.user)
		friendsUpdate.updateFriendList(socket.handshake.auth?.user)
	}	
}

module.exports = newConnectionHandler