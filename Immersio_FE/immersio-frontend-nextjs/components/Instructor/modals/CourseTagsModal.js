import { Button, Form, Input, Modal, Select } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useTranslation } from "next-i18next";
import { useEffect } from "react";

const { TextArea } = Input;

const TagColor = ({ value, onChange }) => {
  const { t } = useTranslation()
  const arrays = [
    { id: 1, label: '', value: '#00CFEA' },
    { id: 2, label: '', value: '#FEB055' },
    { id: 3, label: '', value: '#046A61' },
    { id: 4, label: '', value: '#7171F8' },
  ]

  return (
    <Select
      style={{ width: '100%' }}
      placeholder={t('dashboard.placeholder.select_tag')}
      value={value}
      onChange={onChange}
      optionLabelProp="label"
    >
      {arrays.map((session, index) => (
        <Select.Option
          key={index}
          value={session.value}
          style={{ backgroundColor: session.value, height: '25px', cursor: 'pointer' }}
        >
          &nbsp;
        </Select.Option>
      ))}
    </Select>
  )
}

const CourseTagsModal = ({ isEdit = false, initialValues = {}, onFinish, visible = false, setVisible }) => {
  const { t } = useTranslation()
  const [form] = useForm();

  useEffect(() => {
    form.resetFields();
  }, [initialValues])

  return (
    <Modal
      title={isEdit ? t('dashboard.title.update_tag') : t('dashboard.title.create_tag')}
      centered
      layout="vertical"
      visible={visible}
      onCancel={()=> setVisible(false)}
      footer={null}
    >
      <Form form={form} initialValues={initialValues} onFinish={(data) => onFinish(data, isEdit)}>
        <Form.Item hidden name="id" label="" />
        <Form.Item name="name" label={t('dashboard.label.tag_name')} rules={[{ required: true, message: t('dashboard.notification.please_input_tag_name') }]}>
          <Input placeholder={t('dashboard.placeholder.daily_conversation')} />
        </Form.Item>
        <Form.Item name="description" label={t('dashboard.label.tag_description')}>
          <TextArea placeholder={t('dashboard.placeholder.course_tag_provides_basic')} />
        </Form.Item>
        <Form.Item name="hexColor" label={t('dashboard.label.tag_color')}>
          <TagColor />
        </Form.Item>

        <Form.Item name="" label="">
          <Button
            type="primary"
            htmlType="submit"
            style={{ background:'#25A5AA', width: '100%' }}
            size="large"
            shape="round"
          >
            {isEdit ? t('dashboard.button.update') : t('dashboard.button.create')}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CourseTagsModal