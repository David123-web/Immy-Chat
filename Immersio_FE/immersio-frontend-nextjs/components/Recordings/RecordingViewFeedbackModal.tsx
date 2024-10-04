import { Modal } from 'antd';
import RecordingsFeedback from '../RecordingsFeedback';

const RecordingViewFeedbackModal = ({ query, open, onCancel, role, handleSubmit }) => {  
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
      <RecordingsFeedback
        query={query}
        role={role}
        actions={{
          handleSubmit
        }}
      />
    </Modal>
  )
}

export default RecordingViewFeedbackModal
