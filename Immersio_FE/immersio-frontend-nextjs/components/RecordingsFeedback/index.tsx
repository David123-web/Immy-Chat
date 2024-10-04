import { RouterConstants } from "@/constants/router"
import RecordingFeedback from "./RecordingFeedback"

const RecordingsFeedback = (props) => {
  return (
    <div className="recordings">
      <div className="recordings__feedback">
        <h3 className="tw-text-center">{RouterConstants.DASHBOARD_RECORDINGS_FEEDBACK.name}</h3>
        <div className="tw-mt-10 tw-max-w-[60%] tw-mx-auto">
          <RecordingFeedback {...props} />
        </div>
      </div>
    </div>
  )
}

export default RecordingsFeedback