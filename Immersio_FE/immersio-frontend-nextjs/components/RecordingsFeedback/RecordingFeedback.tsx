import { ROLE_TYPE } from '@/src/interfaces/auth/auth.interface';
import { Input } from 'antd';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import AudioPlayRecord from '../PreviewLesson/components/audioPlayRecord';
import LoadingAudioOrImage from '../v2/LoadingAudioOrImage';
import RecordAudioFeedback from './RecordAudioFeedback';

const RecordingFeedback = ({ role, query, actions }) => {
  const { t } = useTranslation()
  const [feedback, setFeedback] = useState(query?.feedback || '')
  const [fileId, setFileId] = useState(query?.fileId)
  const [destroy, setDestroy] = useState(false)

  useEffect(() => {
    setFeedback(query?.feedback || '')
  }, [query?.feedback])

  useEffect(() => {
    if (fileId !== query?.fileId) {
      setDestroy(true)
      setTimeout(() => {
        setFileId(query?.fileId)
        setDestroy(false)
      }, 500);
    }
  }, [query?.fileId])

  return (
    <div className="stepDialogs">
      <div className="stepDialog">
        <p className="dialogExplain">{query?.content}</p>

        <div className="dialogStep tw-flex tw-justify-center tw-items-center">
          <div className="dialogStepAudio tw-cursor-pointer">
            {destroy === false ? (
              <LoadingAudioOrImage width={90} src={fileId}>
                {({ srcState }) => (
                  <AudioPlayRecord src={srcState} index={1} />
                )}
              </LoadingAudioOrImage>
            ) : <div className='tw-h-[60px]' />}
          </div>
        </div>

        {role !== ROLE_TYPE.STUDENT ? (
          <div className="tw-flex tw-flex-col tw-items-center tw-justify-center mt-10">
            <Input.TextArea
              onChange={(e) => setFeedback(e.target.value)}
              value={feedback}
              placeholder="Type your feedback here"
              rows={5}
            />
          </div>
        ) : null}

        <div className="tw-flex tw-flex-col tw-items-center tw-justify-center mt-10 stepDialogRecord">
          <p className="tw-text-[16px]">
            {t('dashboard.label.AUDIO_RECORDING')}
          </p>
          <RecordAudioFeedback onChange={(audioBlob) => actions.handleSubmit(audioBlob, feedback)} />
        </div>
      </div>
    </div>
  )
}

export default RecordingFeedback
