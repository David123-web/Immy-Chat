const connectedUsers =  new Map()
let io = null

const setSocketServerInstance = (ioInstance) => {
	io = ioInstance
}

const getSocketServerInstance = () => {
	return io
}

const addNewConnectedUser = ({ socketId, userId}) => {
	connectedUsers.set(socketId, {userId})
}

const removeConnectedUser = (socketId) => {
	if(connectedUsers.has(socketId)){
		connectedUsers.delete(socketId)
	}
}

const getActiveConnections = (userId) => {
	const activeConnections = []
	//console.log(connectedUsers)
	connectedUsers.forEach(function(value, key) {
		if(value.userId === userId) {
			activeConnections.push(key)
		}
	})
	return activeConnections
}

const getOnlineUsers = () => {
	const onlineUsers = []
	connectedUsers.forEach((value, key) => {
		onlineUsers.push({ socketId: key, userId: value.userId})
	})
	return onlineUsers
}

module.exports = { 
	addNewConnectedUser,
	removeConnectedUser,
	getActiveConnections,
	getSocketServerInstance,
	setSocketServerInstance,
	getOnlineUsers
}