var btnStartRecording = document.getElementById('btn-start-recording');
var btnStopRecording = document.getElementById('btn-stop-recording');
var btnReleaseMicrophone = document.querySelector('#btn-release-microphone');
var btnDownloadRecording = document.getElementById('btn-download-recording');
var btnStartStop = document.getElementById('btn-start-stop');
var msgContainer = document.getElementById('chat');
var btnImage = document.getElementById('btnImg');
var audio = document.querySelector('audio');

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
// var socket = io('https://my-iphone.herokuapp.com/');
btnImage.src = '../images/idle_mic.svg';
btnStartRecording.disabled = false;

//Crear bubble div
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

document.addEventListener('keydown', function(e) {

  if (e.which == 10 || e.which == 13){
    var transcript = document.getElementById('txt').value;
    document.getElementById('txt').value = "";
    msgContainer.removeChild(bounSig);
    // setUserMessage(transcript);
  } if (e.which == 8) {
    if (hasBounSig) {
      hasBounSig = false;
      hasBounSig = false;
      msgContainer.removeChild(bounSig);
    }
  } else {
    msgContainer.appendChild(bounSig);
    bounSig.scrollIntoView();
  }
});


function captureMicrophone(callback) {

    btnReleaseMicrophone.disabled = false;

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
        alert('Unable to capture your microphone. Please check console logs.');
        console.error(error);
    });
}

btnStartStop.onclick = async function() {
  if (state == 'start') {
    console.log('Starting...');
    startRecording();
    //txt.innerHTML = "Starting...<br>";
    state = 'stop';

  } else {
    console.log('Stopping...');
    state = 'start';
    btnImage.src = '../images/idle_mic.svg';
    //txt.innerHTML = "Stopping...<br>";
    await stopRecording();
  }
}

btnStartRecording.onclick = function(){
  // this.disabled = true;
  startRecording();
  // btnStopRecording.disabled = false;
  // btnDownloadRecording.disabled = true;
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

          click(btnStartRecording);
      });
      return;
  }
  replaceAudio();
  //txt.innerHTML = "I'm recording";
  btnImage.src = '../images/pause_mic.svg';
  socket.emit('start', "starting!");

  audio.muted = true;
  audio.srcObject = microphone;

  // Aquí


  //

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
          //Pass the audio recorded
          socket.emit('audio', blob);
      }
  });

  recorder.startRecording();
}

btnStopRecording.onclick = async function(){
  // this.disabled = true;
  await stopRecording();
}

async function stopRecording() {

  recorder.stopRecording(stopRecordingCallback);
  var response;

  // await new Promise((resolve, reject)=> {
  //   recorder.stopRecording(async function() {
  //     await recorder.getDataURL(async function(audioDataURL) {
  //       myAudio = audioDataURL;
  //       resolve();
  //     });
  //   });
  // });

  await new Promise((resolve, reject)=> {
    socket.emit('stop', "stopped", function(res) {
        response = res;
        resolve(res);
    });
  });

  console.log(response);

  // if (response.transcript == ""){
    //txt.innerHTML = "I didn't understand, please, try again or check your microphone";
  // } else{
  var msgContainer = document.getElementById('chat');
  //SERVER ANSWER
  serverMsg = document.createElement('div');
  msgContainer.appendChild(serverMsg);
  serverMsg.className += "message stark";
  serverMsg.innerText = response.transcript;
  serverMsg.scrollIntoView();
  // USER QUEST
  userMsg = document.createElement('div');
  userMsg.className += "message parker";
  userMsg.innerText = response.answer;
  msgContainer.appendChild(userMsg);
  serverMsg.scrollIntoView();
    //txt.innerHTML = "<b>You said:</b> " + response.transcript;
    var arrayBuffer = new Uint8Array(response.audio);
      const blob = new Blob([arrayBuffer], { type: "audio/wav" });
      console.log(window.URL.createObjectURL(blob));

      var newAudio = document.createElement('audio');
      newAudio.controls = true;
      newAudio.autoplay = false;

      if(response.audio) {
          newAudio.src = window.URL.createObjectURL(blob);
      }

      var parentNode = audio.parentNode;
      parentNode.innerHTML = '';
      parentNode.appendChild(newAudio);

      audio = newAudio;
      console.log("Finalizado");
  // }

  setTimeout(function() {
    if(!audio.paused) return;

    setTimeout(function() {
        if(!audio.paused) return;
        audio.play();
    }, 1000);

    audio.play();
  }, 300);

  audio.play();

  if(isSafari) {
      click(btnReleaseMicrophone);
  }

  console.log("Everything is done!");
  audio.play();
}

function stopRecordingCallback() {
    audio.src = null;
    recorder.microphone.stop();
    if(isSafari) {
        click(btnReleaseMicrophone);
    }
    recorder = null;
}

btnDownloadRecording.onclick = function() {
    this.disabled = true;
    if(!recorder || !recorder.getBlob()) return;

    if(isSafari) {
        recorder.getDataURL(function(dataURL) {
            SaveToDisk(dataURL, getFileName('mp3'));
        });
        return;
    }

    var blob = recorder.getBlob();
    var file = new File([blob], getFileName('mp3'), {
        type: 'audio/mp3'
    });
    invokeSaveAsDialog(file);
};

function click(el) {
    el.disabled = false; // make sure that element is not disabled
    var evt = document.createEvent('Event');
    evt.initEvent('click', true, true);
    el.dispatchEvent(evt);
}

btnReleaseMicrophone.onclick = function() {
    this.disabled = true;
    btnStartRecording.disabled = false;

    if(microphone) {
        microphone.stop();
        microphone = null;
    }

    if(recorder) {
        // click(btnStopRecording);
    }
};

function replaceAudio(src) {
  var arrayBuffer = new Uint8Array(src);
    const blob = new Blob([arrayBuffer], { type: "audio/wav" });
    console.log(window.URL.createObjectURL(blob));

    var newAudio = document.createElement('audio');
    newAudio.controls = true;
    newAudio.autoplay = false;

    if(src) {
        // newAudio.src = src;
        newAudio.src = window.URL.createObjectURL(blob);
        // newAudio.play();
    }

    var parentNode = audio.parentNode;
    parentNode.innerHTML = '';
    parentNode.appendChild(newAudio);

    audio = newAudio;
    console.log("Finalizado");
}
