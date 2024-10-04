const dialogflow = require('@google-cloud/dialogflow')
const { Configuration, OpenAIApi } = require("openai");
const lib = require('../../common/Lib');
const uuid = require('uuid')
const sessionId = uuid.v4()
const axios = require('axios');
const { getLessonData } = require('../../db');

const configuration = new Configuration({
    organization: 'org-H3OcKuqnqnnPhBpR9kJBIP9N',
    apiKey: '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'
});

const openai = new OpenAIApi(configuration);
const projectId = process.env.OPENSPEAK_PROJECTID
let messagelength = 0;
const ChatBotController = {
    askImmy: async (req, res) => {
        console.log("~~~~~~~ ask Immy")
        const data = JSON.stringify({
            "sender": 'askImmy',//user?._id,  // sender ID of the user sending the message
            "message": req.body.message
        })
        await axios.post('http://35.182.122.148:5005/webhooks/rest/webhook', data).then(res2 => {
            var msg = {
                answer: res2?.data[0]?.text
            }
            console.log(msg)
            res.status(200).json(msg);
        }).catch(err => {
            console.log(err)
            return res.status(400)?.json({ message: err });
        })
    },

    askOpie2: async (message, socketId) => {
        try {
            console.log('~~~~~~~~~~~ askOpie2')
            const lessonObject = await getLessonData(socketId);
            if(lessonObject){
                messagelength = 60;
                const vocabPrompt = createVocabPrompt(lessonObject);
                const contextPrompt = createContextPrompt(lessonObject);
                var dialogLinesPrompt = createDialogLinesPrompt(lessonObject);
                const phrasePrompt = createPhrasePrompt(lessonObject);
                
                while(dialogLinesPrompt.length>0){
                    const line = dialogLinesPrompt.shift();
                    message.unshift(line);
                }
                if(contextPrompt){
                    message.unshift(contextPrompt);
                }
                if(vocabPrompt){
                    message.push(vocabPrompt);
                }
                if(phrasePrompt){
                    message.push(phrasePrompt);
                }
                message.push({ role: 'system', content: 'Roleplay as a dialogue partner who is talking with the user. Keep answers less than 60 characters and act as a human not AI.' });
               
            } else {
                messagelength = message[message.length - 1].content.length ;
                message.push({role: 'system', content: `You are Immy, a language learning assistant, help the user to improve his language skills, answer him in any language he speaks to you and have a short conversation.` })
                //message.push({role: 'system', content: `You need to respond to the user using words from different levels (beginner, intermediate, advanced) based on the user's prompt. The user's prompt has an analysis of the vocabulary used, respond based on the most recent prompt and analysis.`})
                message.push({role: 'system', content: `You must keep your answers less than ${messagelength} characters.` })
                message.push({role: 'system', content: "Generate the response that has the same level as the complexity of the sentence structure and the depth and adequacy of the information conveyed by the most recent user's input."})
                
                
                // message.push({role: 'system', content: "The response should be chatting with the user and do not explicity indicate this is a response."})
                // message.push({role: 'system', content: "Act as a human, not an AI language model."})
                // message.push({role: 'system', content: "Your response should target the most recent user input"})
                
            }
            const completion = await openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: message
                // max_tokens: messagelength
            })
            return completion.data.choices[0].message.content;
        } catch (err) {
            console.log(err)
            return ({ message: err.message })
        }
    },

    askOpie: async (message) => {
        try {
            console.log(message)
            return;
            var queryAns = await ChatBotController.askOpenSpeak(message)
            return queryAns
            await lib.polly.synthesizeSpeech({
                OutputFormat: 'mp3',
                Text: queryAns,
                VoiceId: 'Joanna',
            }, async(err, data) => {
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
                //console.log(msg)
                return (msg);
            })
        }
        catch (err) {
            //console.log(err)
            return({ message: err.message });
        }
    },

    /*askOpie: async (req, res) => {
        try {
            console.log(req.body.message)
            return
            var queryAns = await ChatBotController.askOpenSpeak(req.body.message);
            lib.polly.synthesizeSpeech({
                OutputFormat: 'mp3',
                Text: queryAns,
                VoiceId: 'Joanna',
            }, (err, data) => {
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
                res.status(200).json(msg);
            })
        }
        catch (err) {
            console.log(err)
            return res.status(400)?.json({ message: err.message });
        }
    },*/

    askOpenSpeak: async (query) => {
        // Create a new session
        const sessionClient = new dialogflow.SessionsClient({
            keyFilename: "./private/token/mega-os-pgy9-ba431edb169e.json"
        });
        const sessionPath = sessionClient.projectAgentSessionPath('mega-os-pgy9', sessionId);

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
        //console.log(`  Response: ${result.fulfillmentText}`);
        return result.fulfillmentText;
    },

    hello: async (req, res) => {
        res.send({ ok: true })
    }
}

const createVocabPrompt = (lessonObject) => {
    const vocabulary = lessonObject.vocabulary;
    if(vocabulary && vocabulary.length > 0){
        const immyVocabularyPrompt = {
            "role": "system",
            "content": `Try to naturally fit these vocabulary words in the response: ${vocabulary.join(', ')}`
          };
          return immyVocabularyPrompt;
    } else {
        return null;
    }
};

const createPhrasePrompt = (lessonObject) => {
    const phrases = lessonObject.phrases;
    if(phrases && phrases.length > 0){
        const immyPhrasesPrompt = {
            "role": "system",
            "content": `Try to naturally fit these phrases in the response only if it makes sense: ${phrases.join(', ')}`
          };
          return immyPhrasesPrompt;
    } else {
        return null;
    }
};

const createContextPrompt = (lessonObject) => {
    const context = lessonObject.context;
    if(context && context.length > 0){
        const immyContextPrompt = {
            "role": "system",
            "content": `This is the context of the dialogue: ${context.join(', ')}`
          };
          console.log(immyContextPrompt);
          return immyContextPrompt;
    } else {
        return null;
    }
};

const createDialogLinesPrompt = (lessonObject) => {
    var dialog_lines = lessonObject.dialog_lines;
    const lines = [];
    let num = 0;
    while(dialog_lines && dialog_lines.length > 0){
        if (num % 2 == 0){
            const immyDialogLinesPrompt = {
                "role": "user",
                "content": dialog_lines.pop()
            }; 
            lines.push(immyDialogLinesPrompt);
        }else{
            const immyDialogLinesPrompt = {
                "role": "assistant",
                "content": dialog_lines.pop()
            }; 
            lines.push(immyDialogLinesPrompt);
        }
        num++;
    } 
    if (lines.length == 0){
        return null;
    }
    return lines;
};


module.exports = {
    ...ChatBotController,
    createVocabPrompt,
    createPhrasePrompt,
    createContextPrompt,
    createDialogLinesPrompt
  };