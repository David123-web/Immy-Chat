const lib = require('../../common/Lib')

const AWSPollyController = {

    getVoiceList: async (req, res) => {
        //console.log(JSON.stringify(req.params))
        lib.polly.describeVoices(req.params, function (err, data) {
            if (err) console.log(err, err.stack) // an error occurred
            else {
                console.log(data.Voices)
                res.send(data.Voices)
            }
        })

    },

    getLanguageList: async (req, res) => {
        lib.polly.describeVoices(function (err, data) {
            if (err) console.log(err, err.stack) // an error occurred
            else {
                let lanlist = []
                for (i in data.Voices) {
                    lanlist.push({ 'code': data.Voices[i].LanguageCode, 'language': data.Voices[i].LanguageName })
                }
                var result = lanlist.reduce((unique, o) => {
                    if (!unique.some(obj => obj.code === o.code && obj.language === o.language)) {
                        unique.push(o);
                    }
                    return unique;
                }, []);
                //console.log(result)
                res.send(result)
            }
        })
    },

    generateAIAudio: async (req, res) => {
        console.log(req.body)
        await lib.polly.synthesizeSpeech({
            OutputFormat: 'mp3',
            Text: req.body.sentence,
            VoiceId: req.body.name,
            Engine: req.body.engine
        }, async (err, data) => {
            console.log(data)
            console.log(err)
            if (err) res.status(400).json({ error: err.stack }); // an error occurred
            else res.status(200).json({ audio: data });           // successful response
        })
    }
}

module.exports = AWSPollyController;