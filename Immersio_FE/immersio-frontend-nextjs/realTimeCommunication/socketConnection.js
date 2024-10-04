import { updateDirectChatHistoryIfActive } from './discord/chat'
import io from 'socket.io-client'

let socket = null

export const getSocketConnection = () => {
	return socket
}

export const connectWithSocketServer = (userDetails, dispatch) => {
	console.log(userDetails)

	// socket = io('https://openspeak.io', {
	socket = io('http://localhost:8080', {
		auth: { user: userDetails }
	})
	socket.on('connect', () => {
		console.log("Succesfully connected!")
	})
	socket.on('friends-invitations', (data) => {
		const { pendingInvitations } = data
		dispatch({
			type: "NEW_INVITATION",
			payload: pendingInvitations,
		})
		window.localStorage.setItem("friendsInvitations", pendingInvitations)
	})

	socket.on('friends-list-update', (data) => {
		const { friends } = data
		dispatch({
			type: "FRIEND_LIST_UPDATE",
			payload: friends,
		})
		window.localStorage.setItem("friends", friends)
	})

	socket.on('online-users', (data) => {
		const { onlineUsers } = data
		dispatch({
			type: "UPDATE_ONLINE_USERS",
			payload: onlineUsers,
		})
		window.localStorage.setItem("onlineUsers", onlineUsers)
	})

	socket.on('direct-chat-history', (data) => {
		//console.log('direct-chat-history', data)
		updateDirectChatHistoryIfActive(data, dispatch)


		/*const { messages } = data
		dispatch({
				type: "UPDATE_DISCORD_CONVERSATION",
				payload: messages,
		})
		window.localStorage.setItem("discordMessages", messages)*/
	})
}

export const sendDirectMessage = (data) => {
	socket.emit('direct-message', data)
}

export const getDirectChatHistory = (data) => {
	socket.emit('direct-chat-history', data)
}

export const sendMsgToOpie = async (data, language) => {
	let response;
	let msg = {
		history: data,
		language: language
	}
	await new Promise((resolve, reject) => {
		socket.emit('ask-opie-msg', msg, function (res) {
			response = res;
			resolve(res);
		});
	});
	return response
	//socket.emit('ask-opie-msg', data)
}

export const sendVoiceToOpie = (data) => {
	socket.emit('ask-opie-voice', data)
}

/*export const startAudioStream = () => {
	socket.emit('start-audio-stream')
	console.log('inicia')
}

export const sendAudioStream = async (data) => {
	//console.log('sending: ',data)
	await socket.emit('send-audio-data', data)
	console.log('intermedio')
}*/

export const stopAudioStream = async (audio, chatHistory, language) => {
	let response = null
	let data = {
		audio: audio,
		history: chatHistory,
		language: language
	}
	console.log('Sending... ', data)
	await new Promise((resolve, reject) => {
		socket.emit('finish-audio-stream', data, function (res) {
			response = res
			resolve(response)
		})
	})
	//console.log('Received... ', response)
	return response
}

export const disconnectWithSocketServer = () => { }