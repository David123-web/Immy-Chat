//const FriendInvitation = require('../../models/friendInvitation')
const serverStore = require('../../ServerStore')
//const User = require('../../models/user')

const updateFriendsPendingInvitations = async(userId) => {
	try {
		/*const pendingInvitations = await FriendInvitation.find({
			receiverId: userId
		}).populate('senderId', '_id firstName lastName email')*/
		//Find all active connections of the user
		const receiverList = serverStore.getActiveConnections(userId)
		const io = serverStore.getSocketServerInstance()

		receiverList.forEach((receiverSocketId) => {
			io.to(receiverSocketId).emit('friends-invitations', {
				//pendingInvitations : pendingInvitations ? pendingInvitations : []
			})
			console.log('Updating friends invitations', receiverSocketId)
		})
	} catch(err) {
		console.log(err)
	}
}

const updateFriendList = async(userId) => {
	try {
		//find active connections
		const receiverList = serverStore.getActiveConnections(userId)
		console.log('receiverList', receiverList)
		if (receiverList.length > 0) {
			/*const user = await User.findById(userId, { _id: 1, friends: 1}).populate(
				'friends',
				'_id firstName lastName email image'
			)
			if(user) {
				const friendList = user.friends.map( f => {
					return { 
						id: f._id,
						email: f.email,
						firstName: f.firstName,
						lastName: f.lastName,
						image: f.image
					}
				})
				//emit event
				const io = serverStore.getSocketServerInstance()
				receiverList.forEach( receiverSocketId => {
					io.to(receiverSocketId).emit('friends-list-update', {
						friends: friendList ? friendList : []
					})
				})
			}*/
		}
	} catch(err) {
		console.log(err)
	}
}

module.exports = { 
	updateFriendsPendingInvitations,
	updateFriendList
}