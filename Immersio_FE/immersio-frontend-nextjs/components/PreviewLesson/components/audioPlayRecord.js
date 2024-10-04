import { PauseOutlined } from "@ant-design/icons"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import IMAGE_LESSON_FLOW from "../../../constants/lessons-icon";

const AudioPlayRecord = ({ index, src, size = 60 }) => {
  if (!src) return null;

  const srcRef = useRef(src);
  useEffect(() => {
    srcRef.current = src;

    return () => {
      srcRef.current = undefined
    }
  }, [src])

  const audioRef = useRef();
  const ctrlRef = useRef();
  const pauseRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
      ctrlRef.current.style.display = 'none';
      pauseRef.current.style.display = 'flex';
    } else {
      audioRef.current.pause();
      ctrlRef.current.style.display = 'flex';
      pauseRef.current.style.display = 'none';
    }

    if (audioRef?.current) {
      audioRef.current.addEventListener("ended", function() {
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      });
    }
  }, [isPlaying])

  return (
    <>
      <audio id={`yourAudio-${index}`} ref={audioRef}>
        <source src={src} type='audio/wav' />
      </audio>

      <div className="ms-3 me-3 d-flex align-items-center audio-control">
        <div className="play-icon tw-flex tw-justify-center tw-items-center" id={`audioControl-${index}`} ref={ctrlRef} onClick={() => setIsPlaying(true)}>
          <div className="tw-flex tw-justify-center tw-items-center">
            <Image src={IMAGE_LESSON_FLOW.sound_active} width={size} height={size} />
          </div>
        </div>
        <div className="pause-icon tw-flex tw-justify-center tw-items-center" style={{ cursor: 'pointer', display: 'none' }} id={`audioControl-pause-${index}`} ref={pauseRef} onClick={() => setIsPlaying(false)}>
          <div style={{ width: 60, height: 60 }} className="tw-flex tw-justify-center tw-items-center">
            <PauseOutlined className="icon-new-theme" />
          </div>
        </div>
      </div>
    </>
  )
}

export default AudioPlayRecord