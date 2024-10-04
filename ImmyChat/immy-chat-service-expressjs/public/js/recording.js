var btnStartRecording = document.getElementById('btn-start-recording');
var btnStopRecording = document.getElementById('btn-stop-recording');
var btnReleaseMicrophone = document.querySelector('#btn-release-microphone');
var btnDownloadRecording = document.getElementById('btn-download-recording');
var btnStartStop = document.getElementById('btn-start-stop');
var msgContainer = document.getElementById('chat');
var btnImage = document.getElementById('btnImg');
var audio = document.querySelector('audio');
var wave = document.getElementById('icon');

var myAudio = document.getElementById('aud');

var isEdge = navigator.userAgent.indexOf('Edge') !== -1 && (!!navigator.msSaveOrOpenBlob || !!navigator.msSaveBlob);
var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

var recorder; // globally accessible
var microphone;
var state = 'start';
var interval = 300;
var typing = false;
var hasBounSig = false;
var txt = document.getElementById("sMsg");

var socket = io('http://localhost:8080/');
// var socket = io('https://openspeak.io/');
btnImage.src = '../images/idle_mic.svg';

// BUBBLES
var bounSig = document.createElement('div');
//agregar clase
bounSig.className += "message typing";
//crear bubbles
t1 = document.createElement('em');
t2 = document.createElement('em');
t3 = document.createElement('em');
t1.className += "typing typing-1";
t2.className += "typing typing-2";
t3.className += "typing typing-3";
//append bubbles
bounSig.appendChild(t1);
bounSig.appendChild(t2);
bounSig.appendChild(t3);

// RECORDING SCRIPTS
btnStartStop.onclick = async function() {
  if (state == 'start') {
    startRecording();
    state = 'stop';
  } else {
    state = 'start';
    btnImage.src = '../images/idle_mic.svg';
    await stopRecording();
  }
}

function startRecording() {
  if (!microphone) {
      captureMicrophone(function(mic) {
          microphone = mic;
          if(isSafari) {
              replaceAudio();
              audio.muted = true;
              audio.srcObject = microphone;
              state = 'start';
              //txt.innerHTML = "Please, click again...<br>";
              // alert('Please click startRecording button again. First time we tried to access your microphone. Now we will record it.');
              return;
          }
          // THIS COULD BE IMPORTANT
          startRecording();
      });
      return;
  }
  replaceAudio();
  //txt.innerHTML = "I'm recording";
  btnImage.style.display = 'none';
  wave.style.display = 'block';
  btnImage.src = '../images/pause_mic.svg';

  socket.emit('start', "starting!");
  audio.muted = true;
  audio.srcObject = microphone;

  if(recorder) {
      recorder.destroy();
      recorder = null;
  }

  recorder = RecordRTC(microphone, {
      type: 'audio',
      mimeType: 'audio/webm',
      sampleRate: 44100,
      desiredSampRate: 16000,
      numberOfAudioChannels: 1,
      checkForInactiveTracks: true,
      recorderType: StereoAudioRecorder,
      bufferSize: 4096,

      timeSlice: parseInt(interval), // pass this parameter
      ondataavailable: function(blob) {
          //Send the audio recorded
          socket.emit('audio', blob);
      }
  });
  recorder.startRecording();
}

async function stopRecording(){
  btnImage.style.display = 'block';
  wave.style.display = 'none';
  //if(microphone) microphone.stop()
  await recorder.stopRecording(stopRecordingCallback);
  var response;
  await new Promise((resolve, reject)=> {
    socket.emit('stop', "stopped", function(res) {
        response = res;
        resolve(res);
    });
  });
  //console.log(response);
  setMyMessage(response.transcript, "message stark");
  setMyMessage(response.answer, "message parker");

  if (response.transcript == '') return

  console.log('response=',response.audio.AudioStream)

  var arrayBuffer = new Uint8Array(response.audio.AudioStream);
  console.log('arrayBuffer=', arrayBuffer.buffer)
  const blob = new Blob([arrayBuffer.buffer], { type: "audio/wav" });
  audio.src = window.URL.createObjectURL(blob);
  myAudio.src = window.URL.createObjectURL(blob)
  // replaceAudio(response.audio);*/
  myAudio.play()

  setTimeout(function() {
    if(!myAudio.paused) return;

    setTimeout(function() {
        if(!myAudio.paused) return;
        myAudio.play();
    }, 1000);

    myAudio.play();

  }, 300);


  if(isSafari) {
      click(btnReleaseMicrophone);
  }
  myAudio.play();
  myAudio.play();
  playOutput(response.audio.AudioStream);
  myAudio.play();
  return response.audio.AudioStream;

  // replaceAudio(response.audio);
  //
  // setTimeout(function() {
  //   if(!audio.paused) return;
  //
  //   setTimeout(function() {
  //       if(!audio.paused) return;
  //       audio.play();
  //   }, 1000);
  //
  //   audio.play();
  // }, 300);
  //
  // audio.play();
  //
  // if(isSafari) {
  //     click(btnReleaseMicrophone);
  // }
  //
  // console.log("Everything is done!");
  // audio.play();
}

async function stopRecordingCallback() {
    audio.src = null;
    recorder.stop();
    if(isSafari) { click(btnReleaseMicrophone); }
    recorder = null;
}

function click(el) {
    el.disabled = false; // make sure that element is not disabled
    var evt = document.createEvent('Event');
    evt.initEvent('click', true, true);
    el.dispatchEvent(evt);
}

btnReleaseMicrophone.onclick = function() {
    if(microphone) {
        microphone.stop();
        microphone = null;
    }
    if(recorder) { click(btnStopRecording); }
};

function replaceAudio(src) {
    var arrayBuffer = new Uint8Array(src);
    const blob = new Blob([arrayBuffer], { type: "audio/wav" });
    //console.log(window.URL.createObjectURL(blob));

    var newAudio = document.createElement('audio');
    newAudio.controls = true;
    newAudio.autoplay = false;
    if(src) {
        newAudio.src = window.URL.createObjectURL(blob);
    }
    var parentNode = audio.parentNode;
    parentNode.innerHTML = '';
    parentNode.appendChild(newAudio);
    audio = newAudio;
}

function captureMicrophone(callback) {
    if(microphone) {
        callback(microphone);
        return;
    }
    if(typeof navigator.mediaDevices === 'undefined' || !navigator.mediaDevices.getUserMedia) {
        alert('This browser does not supports WebRTC getUserMedia API.');
        if(!!navigator.getUserMedia) {
            alert('This browser seems supporting deprecated getUserMedia API.');
        }
    }
    navigator.mediaDevices.getUserMedia({
        audio: isEdge ? true : {
            echoCancellation: false
        }
    }).then(function(mic) {
        callback(mic);
    }).catch(function(error) {
        alert('Unable to capture your microphone. ' + error);
        console.error(error);
    });
}



// BUBBLES SCRIPTS
document.getElementById('txt').addEventListener('input', async function(e) {
    if (document.getElementById('txt').value == "" && hasBounSig) {
        //console.log('is empty');
        msgContainer.removeChild(bounSig);
        hasBounSig = false;
    } else {
        //console.log('is typing');
        msgContainer.appendChild(bounSig);
        //bounSig.scrollIntoView();
        hasBounSig = true;
    }
});

document.getElementById('txt').addEventListener('keydown', async function(e) {
    if (e.which == 13) {
      //console.log('Presionó enter');
      await enter();
      return;
    }
});

document.getElementById('txt_btn').onclick = async function() {
    await enter();
    return;
}

async function enter() {
    var transcript = document.getElementById('txt').value;
    document.getElementById('txt').value = "";
    setMyMessage(transcript, "message stark");
    msgContainer.removeChild(bounSig);
    var myAudio = await sendMessage(transcript);
    playOutput(myAudio);
    audio.play();
    return;
}

async function sendMessage(msg) {
  audio.src = null;
  if(isSafari) { click(btnReleaseMicrophone); }
  recorder = null;
  var response;
  console.log(msg)
  await new Promise((resolve, reject)=> {
    socket.emit('message', msg, function(res) {
        response = res;
        console.log(response)
        resolve(res);
    });
  });
  console.log('response=',response)
  setMyMessage(response.answer, "message parker");


  var arrayBuffer = new Uint8Array(response.audio.AudioStream);
  console.log('arrayBuffer=', arrayBuffer.buffer)
  const blob = new Blob([arrayBuffer.buffer], { type: "audio/wav" });
  myAudio.src = window.URL.createObjectURL(blob)
  // replaceAudio(response.audio);*/
  myAudio.play()
  //audio.src = window.URL.createObjectURL(blob);
  // replaceAudio(response.audio);

  setTimeout(function() {
    if(!myAudio.paused) return;

    setTimeout(function() {
        if(!myAudio.paused) return;
        myAudio.play();
    }, 1000);

    myAudio.play();
  }, 300);

  myAudio.load();

  myAudio.play();
  if(isSafari) {
      click(btnReleaseMicrophone);
  }
  //console.log("Everything is done!");
  myAudio.play();
  return response.audio;
}

function playOutput(arrayBuffer){
 let audioContext = new AudioContext();
 let outputSource;
 try {
     if(arrayBuffer.byteLength > 0){
         // 2)
         audioContext.decodeAudioData(arrayBuffer,
         function(buffer){
             // 3)
             audioContext.resume();
             outputSource = audioContext.createBufferSource();
             outputSource.connect(audioContext.destination);
             outputSource.buffer = buffer;
             outputSource.start(0);
         },
         function(){
             console.log(arguments);
         });
     }
 } catch(e) {
     console.log(e);
 }
}

function setMyMessage(msg, msgClass) {
  var myMsg = document.createElement('div');
  msgContainer.appendChild(myMsg);
  myMsg.className += msgClass;
  myMsg.innerText = msg;
  document.getElementById("txt").scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  //console.log("No Scrolling");
}
