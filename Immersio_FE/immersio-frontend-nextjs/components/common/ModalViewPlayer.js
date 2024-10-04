import { VideoCameraFilled } from "@ant-design/icons"
import { Modal } from "antd"
import { useState } from "react"
import ReactPlayer from "react-player";

const ModalViewPlayer = ({ url, label }) => {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <style jsx global>{`
				.ant-modal-content { margin-bottom: 80px }
			`}</style>
      <div>
        <a
          className="d-flex align-items-center color-theme-3"
          onClick={() => setOpen(true)}
        >
          <VideoCameraFilled className="color-theme-3 tw-text-[25px]" style={{margin:'0 15px 0 50px'}}/>{label}
        </a>
      </div>

      {isOpen ? (
        <Modal
          width={800}
          title={`Preview ${label}`}
          centered
          open={isOpen}
          onCancel={() => setOpen(false)}
          footer={null}
        >
          <ReactPlayer
            url={url}
            width='100%'
            height='400px'
            controls
            config={{
              file: {
                attributes: {
                  controlsList: 'nodownload',
                }
              }
            }}
          />
        </Modal>
      ) : null}
    </>
  )
}

export default ModalViewPlayer