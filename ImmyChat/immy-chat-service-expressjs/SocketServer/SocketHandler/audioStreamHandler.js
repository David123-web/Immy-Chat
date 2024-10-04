const ChatBotController = require('../../controllers/AskBot/CAskBot')
const AWSPollyController = require('../../controllers/AWSPolly/CAWSPolly')
const textToSpeech = require('@google-cloud/text-to-speech')
const dialogflow = require('@google-cloud/dialogflow');
const speechToText = require('@google-cloud/speech')
const uuid = require('uuid');
// A unique identifier for the given session
const sessionId = uuid.v4();
const path = require('path');
const speechClient = new speechToText.SpeechClient()
const textClient = new textToSpeech.TextToSpeechClient()
const projectId = process.env.OPENSPEAK_PROJECTID
const fs = require('fs')
const axios = require('axios')
const languageCode = [
    { language: 'Chinese', code: 'yue-HK', voice: 'Zhiyu' },
    { language: 'English', code: 'en-US', voice: 'Joanna' },
    { language: 'French', code: 'fr-FR', voice: 'Celine' },
    { language: 'German', code: 'de-DE', voice: 'Marlene' },
    { language: 'Japanese', code: 'ja-JP', voice: 'Mizuki'},
    { language: 'Korean', code: 'ko-KR', voice: 'Seoyeon' },
    { language: 'Vietnamese',   code: 'vi-VN', voice: 'en-US' }
]

const audioStreamHandler = async(data, socketId) => {
    try {
        console.log('~~~~~~~~~~~~ audioStreamHandler')
        let history = [...data.history]
        console.log('audioStreamHandler=',data)
        let language = {}
        language = languageCode.find((code) => code.language === data.language)
        let audio_path = path.resolve(process.cwd(), 'public/audio/', socketId+'.mp3')
        await new Promise((resolve, reject) => {
          fs.writeFile(audio_path, data.audio, (err) => {
          if (err) 
            console.error('Error saving audio file')
          else resolve()
          })
        })
        console.log('File saved successfully.')
        var transcript = await transcribe(fs.createReadStream(audio_path))
        console.log(language)
        var postData = {
          audio_file_addr: audio_path,
          text_from_audio: transcript,
          language: language.language.toLowerCase()
        }
        var evaluation = await axios.post(process.env.ADAPTIVE_LEARNING_URL, postData)
        console.log("V_Eval*************************************************************************************")
        console.log(evaluation.data.vocab_eval)
        // var beginner = evaluation.data.vocab_eval.slice()
        var vocabulary_eval = " Analysis: the prompt has "+evaluation.data.vocab_eval[0]+" words in beginner level, "+evaluation.data.vocab_eval[1]+" words in intermediate level, and "+evaluation.data.vocab_eval[2]+" words in advance level."
        //console.log(vocabulary_eval)
        history.push({ 'role': 'user', 'content': transcript})
        //history.push({ 'role': 'system', 'content': "You need to respond to the user using words from different levels (beginner, intermediate, advanced) based on"+vocabulary_eval})
        var osanswer = await ChatBotController.askOpie2(history, socketId)
        let answer = {
            transcription: transcript,
            answer: osanswer,
            voice: language.voice,
            speed: evaluation.data.fluency_eval
        }
        await fs.unlink(audio_path, (err => {
          if (err) console.log(err);
          else {
            console.log("\nDeleted file: "+audio_path);
          }
        }));
        return answer
	} catch(err) {
		console.log(err)
        return null
	}
}

const opieStreamHandler = async(data) => {
    try {
        let transcript = await STT_Opie(data, 'en-US')
        let answer = await ChatBotController.askOpenSpeak(transcript)
        var msg = {
            transcript: transcript,
            answer: answer,
            voice: 'Joanna'
          }
        return msg
  } catch(err) {
        console.log(err)
        return null
  }
}


async function STT_Opie(myAudio, lanCode) {
  const encoding = 'LINEAR16';
  const sampleRateHertz = 16000;
    const languageCode = lanCode;

  const config = {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  };

  var requestSTT = {
     config: config,
     interimResults: false,
     singleUtterance: true,
   }

  requestSTT.audio = {
    content: myAudio
  };

  const [response] = await speechClient.recognize(requestSTT);
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  return transcription;
}


async function STT(myAudio, lanCode) {
  const encoding = 'WEBM_OPUS';
  const sampleRateHertz = 48000;
    const languageCode = lanCode;

  const config = {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  };

  var requestSTT = {
     config: config,
     interimResults: false,
     singleUtterance: true,
   }

  requestSTT.audio = {
    content: myAudio
  };

  const [response] = await speechClient.recognize(requestSTT);
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  return transcription;
}

async function transcribe(file) {
  const response = await axios.post(
    'https://api.openai.com/v1/audio/transcriptions',
    {
      file,
      model: 'whisper-1'
    },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${process.env.OPENAI_APIKEY}`
      }
    }
  );

  return response.data.text;
}

async function TTS(myTrans) {
  const request = {
    input: {text: myTrans},
    // Select the language and SSML voice gender (optional)
    voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
    // select the type of audio encoding
    audioConfig: {audioEncoding: 'MP3'},
  };
  // Performs the text-to-speech request
  const [response] = await textClient.synthesizeSpeech(request);
  return response.audioContent;
}

const askOpenSpeak = async(query, projectId = 'mega-os-pgy9') => {
  // Create a new session
  const sessionClient = new dialogflow.SessionsClient({
    keyFilename: './private/token/mega-os-pgy9-ba431edb169e.json'//process.env.OPENSPEAK_TOKENID
  });
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);
  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: query,
        // The language used by the client (en-US)
        languageCode: 'en-US',
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult;
  return result.fulfillmentText;
}

/*async function askOpenSpeak(query, projectId = 'mega-os-pgy9') {
  // Create a new session
  const sessionClient = new dialogflow.SessionsClient({
    keyFilename: './private/token/mega-os-pgy9-ba431edb169e.json'//process.env.OPENSPEAK_TOKENID
  });
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);
  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: query,
        // The language used by the client (en-US)
        languageCode: 'en-US',
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult;
  return result.fulfillmentText;
}*/

module.exports = { audioStreamHandler,
                   opieStreamHandler,
                   askOpenSpeak }