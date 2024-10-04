import { ROLE_TYPE } from '@/src/interfaces/auth/auth.interface';
import { AudioOutlined, CommentOutlined, DeleteFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Table, Tooltip } from 'antd';
import moment from 'moment';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import RecordingViewAudioModal from './RecordingViewAudioModal';
import RecordingViewFeedbackModal from './RecordingViewFeedbackModal';

const { confirm } = Modal;

const RecordingInstructorTable = ({ values, items = [], dataSource, actions }) => {
  const { t } = useTranslation()
  const [open, onCancel] = useState(false)
  const [openFeedback, onCancelFeedback] = useState(false)
  const [dialogProcess, setDialogProcess] = useState(0)
  const [query, setQuery] = useState({
    sendToUserId: undefined,
    dialogLineId: undefined,
    feedback: undefined,
    content: undefined,
    fileId: undefined
  })

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

        return (
          <div
            className="tw-flex tw-items-center tw-justify-center tw-cursor-pointer"
            onClick={() => {
              onCancel(true)
              setDialogProcess(record.index)
            }}
          >
            <AudioOutlined className="tw-text-[24px] color-theme-3" />
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

        if (filterFeedback.length && filterFeedback[filterFeedback.length - 1].feedback) {
          return (
            <div className='d-flex align-items-center tw-space-x-4'>
              <div
                className='d-flex align-items-center tw-cursor-pointer'
                onClick={() => {
                  setQuery({
                    sendToUserId: filterFeedback[filterFeedback.length - 1]?.user?.id,
                    dialogLineId: record?.id,
                    feedback: filterFeedback[filterFeedback.length - 1]?.feedback,
                    content: record.content,
                    fileId: filterFeedback[filterFeedback.length - 1]?.fileId
                  })
                  onCancelFeedback(true)
                }}
              >
                <CommentOutlined className='color-theme-4 tw-text-[24px]' />
              </div>
							<Tooltip title={t('dashboard.label.delete_feedback')}>
								<a
									className="btn btn-sm btn-danger mb-1"
									onClick={() => {
										confirm({
											icon: <ExclamationCircleOutlined />,
											content: t('dashboard.modal.are_you_sure_delete'),
											onOk() {
												actions.deleteRecord(filterFeedback[filterFeedback.length - 1]?.id);
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
        const filterSubmit = record.voiceRecords.filter((item) => item.type === 'SUBMIT');
        return (
          <div
            className='d-flex align-items-center tw-cursor-pointer'
            onClick={() => {
              onCancelFeedback(true);
              setQuery({
                sendToUserId: filterSubmit[filterSubmit.length - 1]?.user?.id,
                dialogLineId: record?.id,
                feedback: undefined,
                content: record.content,
                fileId: filterSubmit[filterSubmit.length - 1]?.fileId
              });
            }}
          >
            <Button type="primary" danger>{t('dashboard.button.record')}</Button>
          </div>
        )
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

      <RecordingViewAudioModal
        type="SUBMIT"
        items={items.filter((item) => item.voiceRecords)}
        open={open}
        onCancel={onCancel}
        dialogProcess={dialogProcess}
        setDialogProcess={setDialogProcess}
      />

      <RecordingViewFeedbackModal
        query={query}
        role={ROLE_TYPE.INSTRUCTOR}
        open={openFeedback}
        onCancel={(value) => {
          setQuery({
            sendToUserId: undefined,
            dialogLineId: undefined,
            feedback: undefined,
            content: undefined,
            fileId: undefined
          })
          onCancelFeedback(value)
        }}
        handleSubmit={(audioBlob, feedback) => {
          actions.handleSubmit(audioBlob, feedback, query)
        }}
      />
    </>
  )
}

export default RecordingInstructorTable
