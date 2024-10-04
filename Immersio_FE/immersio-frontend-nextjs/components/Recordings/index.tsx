import { Col, Row, Select } from "antd"
import RecordingInstructorTable from "./RecordingInstructorTable"
import { ROLE_TYPE } from "@/src/interfaces/auth/auth.interface"
import RecordingStudentTable from "./RecordingStudentTable"
import { useTranslation } from 'next-i18next';

const Recordings = (props) => {
  const { t } = useTranslation()
  return (
    <div className="recordings">
      <div className="recordings__filter">
        <Row gutter={30}>
          <Col xs={8}>
            <Select
              placeholder={t('dashboard.placeholder.select_a_user')}
              size="large"
              disabled
              className="tw-w-full"
              value={`${props.userStore?.currentUser?.profile?.firstName} ${props.userStore?.currentUser?.profile?.lastName}`}
            />
          </Col>
          <Col xs={8}>
            <Select
              showSearch
              filterOption={(input, option) =>
                String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              size="large"
              value={props.values.course}
              placeholder={t('dashboard.placeholder.select_a_course')}
              className="w-100"
              onChange={(v) => {
                props.actions.setValues({
                  ...props.values,
                  course: v,
                  lesson: "",
                });
                props.actions.getLessons && props.actions.getLessons(v);
              }}
            >
              {props.dataSource.courses.map((course, index) => (
                <Select.Option key={index} value={course.id} label={course.title}>{course.title}</Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={8}>
            <Select
              showSearch
              filterOption={(input, option) =>
                String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              size="large"
              value={props.values.lesson}
              placeholder={t('dashboard.placeholder.select_a_lesson')}
              className="w-100 custom-select"
              onChange={(v) => {
                props.actions.setValues({ ...props.values, lesson: v });
                props.actions.getIDDialog(v, props.values.course);
              }}
            >
              {props.dataSource.lessons.map((lesson, index) => (
                <Select.Option key={index} value={lesson.id} label={lesson.title}>{lesson.title}</Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
      </div>

      <div className="recordings__table tw-mt-6">
        {props.role === ROLE_TYPE.STUDENT ? (
          <RecordingStudentTable {...props} />
        ) : null}

        {[ROLE_TYPE.INSTRUCTOR, ROLE_TYPE.TUTOR].includes(props.role) ? (
          <RecordingInstructorTable {...props} />
        ) : null}
      </div>
    </div>
  )
}

export default Recordings