import { Button, Modal, Select } from "antd";
import { useEffect, useState } from "react";

const RecordAudio = ({ instructorIdState, allInstructors = [], uploading =  false, onChange }) => {
  const [src, setSrc] = useState('')
  const [srcBlob, setSrcBlob] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // set up basic variables for app
    const record = document.querySelector('.record');
    const stop = document.querySelector('.stop');
    const play = document.querySelector('.play');
    const recordTxt = document.querySelector('.recordTxt');
    const stopTxt = document.querySelector('.stopTxt');
    const playTxt = document.querySelector('.playTxt');

    // const overlay01 = document.querySelector('.video-overlay-step.custom-01');
    // const overlay02 = document.querySelector('.video-overlay-step.custom-02');

    // const soundClips = document.querySelector('.sound-clips');

    // disable stop button while not recording

    record.classList.add('show');
    play.classList.remove('show');
    stop.classList.remove('show');
    recordTxt.classList.add('show');
    stopTxt.classList.remove('show');
    playTxt.classList.remove('show');

    // overlay01.style.display = 'none';
    // overlay02.style.display = 'none';

    // main block for doing the audio recording

    if (navigator.mediaDevices.getUserMedia) {
      console.log('getUserMedia supported.');

      const constraints = { audio: true };
      let chunks = [];

      let onSuccess = function(stream) {
        const mediaRecorder = new MediaRecorder(stream);

        record.onclick = function() {
          setSrc('');
          setSrcBlob('');
          mediaRecorder.start();

          record.classList.remove('show');
          play.classList.remove('show');
          stop.classList.add('show');
          recordTxt.classList.remove('show');
          playTxt.classList.remove('show');
          stopTxt.classList.add('show');

          // overlay01.style.display = 'block';
          // overlay02.style.display = 'block';
        }

        play.onclick = function() {
          record.classList.add('show');
          play.classList.remove('show');
          stop.classList.remove('show');
          recordTxt.classList.add('show');
          playTxt.classList.remove('show');
          stopTxt.classList.remove('show');

          // overlay01.style.display = 'none';
          // overlay02.style.display = 'none';
        }

        stop.onclick = function() {
          mediaRecorder.stop();

          record.classList.remove('show');
          play.classList.add('show');
          stop.classList.remove('show');
          recordTxt.classList.remove('show');
          playTxt.classList.add('show');
          stopTxt.classList.remove('show');

          // overlay01.style.display = 'block';
          // overlay02.style.display = 'block';
        }

        mediaRecorder.onstop = function(e) {
          console.log("data available after MediaRecorder.stop() called.");
          const audio = document.createElement('audio');
          audio.setAttribute('controls', '');

          audio.controls = true;
          const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
          chunks = [];
          const audioURL = window.URL.createObjectURL(blob);
          audio.src = audioURL;
          setSrc(audioURL)
          setSrcBlob(blob)

          audio.play();
          audio.onended = function() {
            console.log("recorder stopped");
          };
        }

        mediaRecorder.ondataavailable = function(e) {
          chunks.push(e.data);
        }
      }

      let onError = function(err) {
        console.log('The following error occured: ' + err);
      }

      navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

    } else {
      console.log('getUserMedia not supported on your browser!');
    }
  }, [])

  return (
    <>
      <style jsx global>
        {`
          .stepDialogRecord .play,
          .stepDialogRecord .record,
          .stepDialogRecord .stop,
          .stepDialogRecord .playTxt,
          .stepDialogRecord .recordTxt,
          .stepDialogRecord .stopTxt {
            z-index: 2;
            opacity: 0;
            visibility: hidden;
            width: 0;
            height: 0;
          }
          .stepDialogRecord .play.show,
          .stepDialogRecord .record.show,
          .stepDialogRecord .stop.show,
          .stepDialogRecord .playTxt.show,
          .stepDialogRecord .recordTxt.show,
          .stepDialogRecord .stopTxt.show {
            opacity: 1;
            visibility: visible;
            width: auto;
            height: auto;
          }
        `}
      </style>
      <div className="tw-flex tw-justify-center tw-items-center">
        <div className='playTxt'>
          <div style={{ color: '#088AEC' }} className="mb-20">
            <audio id="yourAudio-record" controls src={src} />
          </div>
        </div>
        <div className='stopTxt'>
          <p style={{ color: '#088AEC' }} className="mb-20">Recording in progress</p>
        </div>
        <div className='recordTxt'>
          <p style={{ color: '#088AEC' }} className="mb-20">Press record to record your voice</p>
        </div>
      </div>

      <div className="tw-flex tw-justify-center tw-items-center tw-space-x-4">
        <div className="tw-flex tw-justify-center tw-items-center">
          <div className='play'>
            <Button danger type="primary">
              Restart
            </Button>
          </div>
          <div className='stop'>
            <Button danger type="primary">
              Pause
            </Button>
          </div>
          <div className='record'>
            <Button danger type="primary">
              Record
            </Button>
          </div>
        </div>
        <Button
          disabled={!src}
          loading={uploading}
          type="primary"
          className="bg-theme-4 border-theme-4 color-theme-7"
          onClick={() => {
            if (instructorIdState) {
              onChange(srcBlob, instructorIdState)
            } else {
              setVisible(true)
            }
          }}
        >
          Submit
        </Button>
        <Button
          disabled={!src}
          loading={uploading}
          type="primary"
          className="bg-theme-3 border-theme-3 color-theme-7"
          onClick={() => setSrc('')}
        >
          Delete
        </Button>
      </div>

      <Modal
        title="Choose instructor"
        centered
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <Select
          size='large'
          className="w-100"
          value="Give record to co-instructor"
          onChange={(v) => {
            if (onChange) {
              onChange(srcBlob, v)
              setVisible(false)
            }
          }}
          placeholder="Give record to co-instructor"
        >
          {allInstructors.map((item, index) => (
            <Select.Option key={index} value={item.profile?.userId}>
              {item?.profile?.firstName + ' ' + item?.profile?.lastName}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    </>
  )
}
  
export default RecordAudio