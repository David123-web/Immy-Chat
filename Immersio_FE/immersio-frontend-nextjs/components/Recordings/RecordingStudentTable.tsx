import { CommentOutlined, DeleteFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Table, Tooltip } from 'antd';
import moment from 'moment';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import AudioPlayRecord from '../PreviewLesson/components/audioPlayRecord';
import LoadingAudioOrImage from '../v2/LoadingAudioOrImage';
import RecordingViewAudioModal from './RecordingViewAudioModal';

const { confirm } = Modal;

const RecordingStudentTable = ({ values, items = [], dataSource, actions }) => {
  const { t } = useTranslation()
  const [open, onCancel] = useState(false)
  const [dialogProcess, setDialogProcess] = useState(0)

  const columns: any = [
    {
      title: t('dashboard.label.dialogue'),
      dataIndex: 'content',
    },
    {
      title: t('dashboard.label.learner'),
      dataIndex: 'learner',
      render: (text, record) => {
        if (record?.voiceRecords?.length === 0) return null

        const filterSubmit = record.voiceRecords.filter((item) => item.type === 'SUBMIT')
        if (filterSubmit.length === 0) return null

        if (filterSubmit[filterSubmit.length - 1]?.user?.profile) return (
          <div>{filterSubmit[filterSubmit.length - 1]?.user?.profile?.firstName} {filterSubmit[filterSubmit.length - 1]?.user?.profile?.lastName}</div>
        )
        return <div>{filterSubmit[filterSubmit.length - 1]?.user?.email}</div>
      }
    },
    {
      title: <div className="tw-text-center">{t('dashboard.label.student_recordings')}</div>,
      dataIndex: 'student_recordings',
      render: (text, record) => {
        if (record?.voiceRecords?.length === 0) return null

        const filterSubmit = record.voiceRecords.filter((item) => item.type === 'SUBMIT')
        if (filterSubmit.length === 0) return null

        // const param =
        //   `${RouterConstants.DASHBOARD_STUDENT_RECORDINGS.path}/${filterSubmit[filterSubmit.length - 1]?.user?.id}/feedback?dialogLineId=${record?.id}&sendToUserId=${filterSubmit[filterSubmit.length - 1]?.sendToUserId}&fileId=${filterSubmit[filterSubmit.length - 1]?.fileId}&content=${record.content}`

        // if (record?.isDeleted) {
        //   return (
        //     <div className='d-flex align-items-center'>
        //       <Link href={param}>
        //         <a>
        //           <Button type="primary" danger>Record</Button>
        //         </a>
        //       </Link>
        //     </div>
        //   )
        // }

        return (
          <div className='tw-flex tw-items-center tw-justify-center'>
            <div>
              <LoadingAudioOrImage width={90} src={filterSubmit[filterSubmit.length - 1]?.fileId}>
                {({ srcState }) => (
                  <AudioPlayRecord src={srcState} index={1} size={40} />
                )}
              </LoadingAudioOrImage>
            </div>

            <Tooltip title={t('dashboard.label.delete_record')}>
              <a
                className="btn btn-sm btn-danger"
                onClick={() => {
                  confirm({
                    icon: <ExclamationCircleOutlined />,
                    content: t('dashboard.modal.are_you_sure_delete'),
                    onOk() {
                      actions.deleteRecord(filterSubmit[filterSubmit.length - 1]?.id);
                    },
                  });
                }}
              >
                <DeleteFilled
                  style={{ display: 'inline-block', color: '#fff', verticalAlign: 'middle', fontSize: 15 }}
                />
              </a>
            </Tooltip>
          </div>
        )
      }
    },
    {
      title: t('dashboard.label.date_of_recording'),
      dataIndex: 'date_of_recording',
      render: (text, record) => {
        if (record?.voiceRecords?.length === 0) return null

        const filterSubmit = record.voiceRecords.filter((item) => item.type === 'SUBMIT')
        if (filterSubmit.length === 0) return null

        return (
          <span>
            {filterSubmit[filterSubmit.length - 1]?.createdAt
              ? moment(filterSubmit[filterSubmit.length - 1].createdAt).format('MMMM Do YYYY, HH:mm')
              : ''}
          </span>
        )
      },
    },
    {
      title: t('dashboard.label.feedback'),
      dataIndex: 'actions',
      fixed: 'right',
      render: (item, record) => {
        if (record?.voiceRecords?.length === 0) return null

        const filterFeedback = record.voiceRecords.filter((item) => item.type === 'FEEDBACK')
        if (filterFeedback.length === 0) return null

        if (filterFeedback[filterFeedback?.length - 1].feedback) {
          return (
            <div
              className='d-flex align-items-center tw-justify-center tw-cursor-pointer'
              onClick={() => {
                onCancel(true)
                setDialogProcess(record.index)
              }}
            >
              <CommentOutlined className='color-theme-3 tw-text-[24px]' />
            </div>
          )
        }
      },
    },
  ];
  
  return (
    <>
      <Table
        columns={columns}
        dataSource={(items || []).map((item, index) => {
          return {
            index,
            ...item,
          }
        })}
        pagination={{ pageSize: 50 }}
      />

      <div className='tw-text-center'>
        <p className="tw-mt-10 tw-mb-5 tw-text-[20px]">
          {t('dashboard.label.please_book_a_tutor_1_on_1')}
        </p>
        <Button type="primary" size="large" className='open-speak-default-btn btn'>
          {t('dashboard.button.book_a_tutor')}
        </Button>
      </div>

      <RecordingViewAudioModal
        type="FEEDBACK"
        items={items.filter((item) => item.voiceRecords)}
        open={open}
        onCancel={onCancel}
        dialogProcess={dialogProcess}
        setDialogProcess={setDialogProcess}
      />
    </>
  )
}

export default RecordingStudentTable
