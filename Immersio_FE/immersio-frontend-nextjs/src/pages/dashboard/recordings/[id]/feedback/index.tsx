import RecordingsFeedback from '@/components/RecordingsFeedback';
import DashboardRoute from '@/components/routes/DashboardRoute';
import { ROLE_TYPE } from '@/src/interfaces/auth/auth.interface';
import { withTranslationsProps } from '@/src/next/with-app';
import { uploadFile } from '@/src/services/files/apiFiles';
import { getRecordDetail, postRecords } from '@/src/services/video-record/apiRecord';
import { Spin } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';

const RecordingsFeedbackPage = () => {
  const { t } = useTranslation()
  const [loadingSpinning, setLoadingSpinning] = useState(false);
  const router = useRouter()
  const query = router?.query
  const [record, setRecord] = useState({});

  useEffect(() => {
    if (query?.id) {
      // loadRecord(id)
    }
  }, [query?.id])

  const loadRecord = async (id) => {
    try {
      const response = await getRecordDetail(id)
      if (response?.data) {
        setRecord(response.data)
      }
    } catch (error) {
      toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
    }
	}

  const handleSubmit = async (audioBlob, feedback) => {
    setLoadingSpinning(true)

    try {
      const formData = new FormData();
      formData.append("file", new File([audioBlob], `audio-record-teacher.mp3`, {type: "audio/mpeg"}));
      formData.append("public", "false");

      const response = await uploadFile(formData)
      if (response?.data) {
        const responsePostRecord = await postRecords({
          sendToUserId: query.id,
          dialogLineId: query.dialogLineId,
          type: "FEEDBACK",
          // @ts-ignore
          fileId: response?.data?.id,
          feedback,
        })

        if (responsePostRecord) {
          toast.success(t('dashboard.notification.sent_row_success'));
        }
      }
    } catch (err) {
      toast.error(t('dashboard.notification.sent_row_error'));
    } finally {
      setLoadingSpinning(false);
    }
	}

	return (
		<>
			<Head>
				<title>Recordings Feedback</title>
				<meta name="description" content="Generated by create next app" />
			</Head>

			<DashboardRoute>
        <div className="animated fadeIn">
          <Spin spinning={loadingSpinning}>
            <RecordingsFeedback
              query={query}
              role={ROLE_TYPE.INSTRUCTOR}
              items={record}
              actions={{
                handleSubmit
              }}
            />
          </Spin>
        </div>
      </DashboardRoute>
		</>
	);
};

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default RecordingsFeedbackPage;
