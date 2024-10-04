import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { useTranslation } from 'next-i18next';
import AudioPlayRecord from '../PreviewLesson/components/audioPlayRecord';
import LoadingAudioOrImage from '../v2/LoadingAudioOrImage';

const RecordingViewAudioModal = ({ items, open, onCancel, dialogProcess, setDialogProcess, type }) => {
  const { t } = useTranslation()
  return (
    <Modal
      centered
      title=""
      width={900}
      onCancel={() => onCancel(false)}
      open={open}
      footer={null}
      className="recordings"
    >
      <div className="stepDialogs">
        {items.map((session, index) => {
          if (index === dialogProcess) {
            const filter = type === 'SUBMIT'
              ? (session.voiceRecords || []).filter((item) => item.type === 'SUBMIT')
              : (session.voiceRecords || []).filter((item) => item.type === 'FEEDBACK')

            if (filter.length === 0) return null

            return (
              <div key={`stepDialog-${index}`} className="stepDialog">
                <p className="dialogExplain">{session.content}</p>

                <div className="dialogStep tw-flex tw-justify-center tw-items-center">
                  <div
                    className="dialogStepLeft tw-flex tw-justify-center tw-items-center tw-cursor-pointer"
                    style={{
                      width: 32,
                      height: 60
                    }}
                    onClick={() => {
                      if (dialogProcess) {
                        setDialogProcess(dialogProcess - 1)
                      }
                    }}
                  >
                    <LeftOutlined />
                  </div>
                  <div className="dialogStepAudio tw-cursor-pointer">
                    <LoadingAudioOrImage width={90} src={filter[filter.length - 1]?.fileId}>
                      {({ srcState }) => (
                        <AudioPlayRecord src={srcState} index={1} />
                      )}
                    </LoadingAudioOrImage>
                  </div>
                  <div
                    className={`dialogStepRight tw-flex tw-justify-center tw-items-center tw-cursor-pointer ${dialogProcess === items.length ? 'disabled' : undefined}`}
                    style={{
                      width: 32,
                      height: 60
                    }}
                    onClick={() => {
                      if (dialogProcess < items.length - 1) {
                        setDialogProcess(dialogProcess + 1)
                      }
                    }}
                  >
                    <RightOutlined />
                  </div>
                </div>

                <div className="tw-flex tw-flex-col tw-items-center tw-justify-center mt-10">
                  <p className="tw-text-[16px]">
                    {t('dashboard.label.LEARNER_RECORDING')}
                  </p>
                  <LoadingAudioOrImage src={filter[filter.length - 1]?.fileId}>
                    {({ srcState }) => (
                      <div style={{ color: '#088AEC' }}>
                        <audio id="yourAudio-record" controls src={srcState} />
                      </div>
                    )}
                  </LoadingAudioOrImage>
                </div>

                {type === 'FEEDBACK' && filter[filter.length - 1]?.feedback && (
                  <p className='tw-text-center tw-mt-6'>{filter[filter.length - 1]?.feedback}</p>
                )}
              </div>
            )
          }

          return null
        })}
      </div>
    </Modal>
  )
}

export default RecordingViewAudioModal
