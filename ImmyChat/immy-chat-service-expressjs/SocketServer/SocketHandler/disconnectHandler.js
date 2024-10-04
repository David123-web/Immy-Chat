const serverStore = require('../ServerStore')

const disconnectHandler = (socket) => {
	serverStore.removeConnectedUser(socket.id)
	console.log('disconected')
}

module.exports = disconnectHandler