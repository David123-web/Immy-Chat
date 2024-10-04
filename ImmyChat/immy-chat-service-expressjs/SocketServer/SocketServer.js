const directChatHistoryHandler = require('./SocketHandler/directChatHistoryHandler')
const audioStreamHandler = require('./SocketHandler/audioStreamHandler')
const newConnectionHandler = require('./SocketHandler/newConnectionHandler')
const directMessageHandler = require('./SocketHandler/directSocketMessage')
const disconnectHandler = require('./SocketHandler/disconnectHandler')
const ChatBotController = require('../controllers/AskBot/CAskBot')
const AWSPollyController = require('../controllers/AWSPolly/CAWSPolly')
const { setSocketServerInstance } = require('./ServerStore')
const { deleteLessonData } = require('../db/index')
const lib = require('../common/Lib');
var fs = require('fs');
const axios = require('axios')
let socketId;

const languageCode = [
	{ language: 'Chinese', code: 'yue-HK', voice: 'Zhiyu' },
	{ language: 'English', code: 'en-US', voice: 'Joanna' },
	{ language: 'French', code: 'fr-FR', voice: 'Celine' },
	{ language: 'German', code: 'de-DE', voice: 'Marlene' },
	{ language: 'Japanese', code: 'ja-JP', voice: 'Mizuki' },
	{ language: 'Korean', code: 'ko-KR', voice: 'Seoyeon' },
	{ language: 'Vietnamese', code: 'vi-VN', voice: '' }
]

const getSocketId = () => {
	return socketId;
};

const setSocketId = (newSocketId) => {
	socketId = newSocketId;
};

const registerSocketServer = (server) => {

	const io = require('socket.io')(server, {
		cors: {
			origin: '*',
			methods: ["GET", "POST"]
		}
	})

	setSocketServerInstance(io)

	io.use(function (socket, next) {
		newConnectionHandler(socket, io)
  		next()
	})

	io.on('connection', (socket, user) => {
		setSocketId(socket.id)
		console.log(getSocketId());
	    let writeStream;

		socket.on('disconnect', () => {
			deleteLessonData(getSocketId());
			setSocketId('')
			disconnectHandler(socket)
		})

		socket.on('direct-message', (data) => {
			directMessageHandler(socket, data)
		})

		socket.on('direct-chat-history', (data) => {
			directChatHistoryHandler(socket, data)
		})

		socket.on('ask-opie-msg', async function (data, ackCallback) {
			console.log('recibido...', data.history)
			let history = [...data.history]
			var language = languageCode.find((code) => code.language === data.language)
			var transcript = history[history.length - 1]['content']
			console.log(transcript)
			var postData = {
				text_from_audio: transcript,
				language: language.language.toLowerCase()
			}
			var evaluation = await axios.post(process.env.ADAPTIVE_LEARNING_URL, postData)
			console.log("V_Eval*************************************************************************************")
			console.log(evaluation.data.vocab_eval)
			var vocabulary_eval = " Analysis: the prompt has "+evaluation.data.vocab_eval[0]+" words in beginner level, "+evaluation.data.vocab_eval[1]+" words in intermediate level, and "+evaluation.data.vocab_eval[2]+" words in advance level."
			history[history.length - 1] = { 'role': 'user', 'content': transcript}
			//history.push({ 'role': 'system', 'content': "You need to respond to the user using words from different levels (beginner, intermediate, advanced) based on"+vocabulary_eval})
			var answer = await ChatBotController.askOpie2(history, socketId)
			console.log('respuesta...', answer)
			await lib.polly.synthesizeSpeech({
				OutputFormat: 'mp3',
				Text: answer,
				VoiceId: language.voice,
			}, async (err, data) => {
				if (err) {
					console.error(err.toString());
					var msg = {
						answer: answer,
						audio: null
					}
				} else {
					var msg = {
						answer: answer,
						audio: data
					}
				}
				ackCallback(msg)
			})
		})

		socket.on('finish-audio-stream', async function (data, ackCallback) {
			console.log('~~~~~~~ Socket Server finish-audio-stream server=', data)
			const answer = await audioStreamHandler.audioStreamHandler(data, socketId)
			console.log(`<speak><prosody rate="${answer.speed}"> ${answer.answer} </prosody></speak>`)
			await lib.polly.synthesizeSpeech({
				OutputFormat: 'mp3',
				TextType: 'ssml',
				Text: `<speak><prosody rate="${answer.speed}"> ${answer.answer} </prosody></speak>`,
				VoiceId: answer.voice,
			}, async (err, data) => {
				if (err) {
					console.error(err.toString());
					var msg = {
						transcription: answer.transcription,
						answer: answer.answer,
						audio: null
					}
				} else {
					var msg = {
						transcription: answer.transcription,
						answer: answer.answer,
						audio: data
					}
				}
				ackCallback(JSON.stringify(msg))
			})
		});

		socket.on('start', async function(data) {
	      	writeStream = await fs.createWriteStream('./public/audio/'+getSocketId()+'.wav');
	 	});

	 	socket.on('audio', async function(data) {
      		writeStream.write(data);
  		});

  		socket.on('stop', async function(audio, ackCallback) {
      		writeStream.end();
      		const answer = await audioStreamHandler.opieStreamHandler(fs.readFileSync('./public/audio/'+getSocketId()+'.wav').toString('base64'))
      		console.log('answer=',answer)
      		await fs.unlink('./public/audio/'+getSocketId()+'.wav', (err => {
		            if (err) console.log(err);
		            else {
		              console.log("\nDeleted file: "+'./public/audio/'+getSocketId()+'.wav');
		            }
		    }));
      		if (answer === null) {
      			var msg = {
					transcript: null,
					answer: null,
					audio: null
				}
      			ackCallback(msg)
      		}
	      	await lib.polly.synthesizeSpeech({
					OutputFormat: 'mp3',
					Text: answer.answer,
					VoiceId: answer.voice,
			}, async (err, data) => {
					if (err) {
						console.error(err.toString());
						var msg = {
							transcript: answer.transcript,
							answer: answer.answer,
							audio: null
						}
					} else {
						var msg = {
							transcript: answer.transcript,
							answer: answer.answer,
							audio: data
					}
				}		
				ackCallback(msg)
			})
  		});

  		socket.on('message', async function(data, ackCallback) {
      		var queryAns = await audioStreamHandler.askOpenSpeak(data)
      		if (!queryAns) {console.log('nononono')}
      		console.log('queryAns=',queryAns)
      		await lib.polly.synthesizeSpeech({
					OutputFormat: 'mp3',
					Text: queryAns,
					VoiceId: 'Joanna'
					,
			}, async (err, data) => {
					if (err) {
						console.error(err.toString());
						var msg = {
							answer: queryAns,
							audio: null
						}
					} else {
						var msg = {
							answer: queryAns,
							audio: data
					}
				}
				ackCallback(msg)
			})
  		});

  	});
}

module.exports = { registerSocketServer, getSocketId };
