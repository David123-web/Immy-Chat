// Source: https://codesandbox.io/s/81zkxw8qnl?file=/src/useRecorder.js:0-1238
import { stopAudioStream } from '../realTimeCommunication/socketConnection'
import { useEffect, useState } from 'react'

const useRecorder = () => {
    const [messagesHistory, setMessagesHistory] = useState([])
    const [language, setLanguage] = useState('')
	const [audioURL, setAudioURL] = useState('')
	const [isRecording, setIsRecording] = useState(false)
	const [recorder, setRecorder] = useState(null)

	useEffect(() => {
		// Lazily obtain recorder first time we're recording.
    	if (recorder === null) {
      		if (isRecording) {
        		requestRecorder().then(setRecorder, console.error);
      		}
      		return;
    	}

    	// Manage recorder state.
    	if (recorder.state === 'inactive' && isRecording) {
      		recorder.start();
    	} else if (recorder.state === 'recording'){
      		recorder.stop();
    	}

    	// Obtain the audio when ready.
    	const handleData = async(e) => {
            let a = await stopAudioStream(e.data, messagesHistory, language)
            setAudioURL(JSON.parse(a))
    	};

    	recorder.addEventListener("dataavailable", handleData)
    	return () => recorder.removeEventListener("dataavailable", handleData)
  	}, [recorder, isRecording])

  	const startRecording = () => {
	    setIsRecording(true)
	}

    const stopRecording = (history, language) => {
        setMessagesHistory(history)
        setLanguage(language)
	    setIsRecording(false)
	}

	return [audioURL, isRecording, startRecording, stopRecording]
}

async function requestRecorder() {
  	const stream = await navigator.mediaDevices.getUserMedia({ 
  		audio: {
  			sampleRate: 48000,
      		numberOfAudioChannels: 1,
      		checkForInactiveTracks: true,
  		}
  	})
  	return new MediaRecorder(stream)
}

export default useRecorder