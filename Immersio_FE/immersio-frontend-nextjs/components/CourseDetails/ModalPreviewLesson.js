import PreviewPage from "../PreviewLesson";
import { CloseCircleFilled } from "@ant-design/icons";

const ModalPreviewLesson = ({ setIsShowPreviewLesson }) => {
  return (
    <div className="lesson-preview lesson-preview-modal">
      <style jsx global>{`
        .lesson-preview-modal {
          position: fixed;
          top: 80px;
          left: 0;
          z-index: 2224;
          width: 100%;
          height: calc(100vh - 80px);
          background-color: var(--tp-new_theme-7);
        }
        .lesson-preview-modal .step-custom {
          min-height: calc(100vh - 205px);
          height: calc(100vh - 205px);
        }
      `}</style>
      <span
        onClick={() => setIsShowPreviewLesson(false)}
        style={{
          position: "fixed",
          top: 95,
          left: 30,
          color: "#A0A0A0",
          fontSize: 30,
          cursor: "pointer",
        }}
      >
        <CloseCircleFilled />
      </span>
      <PreviewPage isAdmin />
    </div>
  );
};

export default ModalPreviewLesson;
