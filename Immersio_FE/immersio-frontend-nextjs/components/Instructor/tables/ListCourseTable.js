import {
  CloseOutlined, DeleteFilled, EditFilled,
  ExclamationCircleOutlined,
  EyeFilled,
  UndoOutlined,
  UpOutlined
} from '@ant-design/icons';
import { Modal, Table, Tooltip } from 'antd';
import React from 'react';
import { RouterConstants } from '../../../constants/router';
import { useTranslation } from 'next-i18next';
const { confirm } = Modal;

const ListCourseTable = ({ items, dataSource, actions }) => {
  const { t } = useTranslation()

  const columns = [
    {
      title: 'ID',
      dataIndex: '',
      render: (text, record, index) => {
        return <span>{index+1}</span>
      },
    },
    {
      title: t('dashboard.label.language'),
      dataIndex: 'language',
      render: (text, record) => {
        const filter = (dataSource?.languages || []).filter((s) => s?.id?.toString() === record?.courseLanguageId?.toString())
        return (
          <>{filter?.length && filter[0].name}</>
        )
      }
    },
    {
      title: t('dashboard.label.title'),
      dataIndex: 'title',
    },
    {
      title: t('dashboard.label.tags'),
      dataIndex: 'tags',
      render: (text, record) => {
        return (
          <>{(record?.tags || []).map(({ name }) => name).join(', ')}</>
        )
      }
    },
    {
      title: t('dashboard.label.level'),
      dataIndex: 'level',
      render: (text, record) => {
        const filter = (dataSource?.levels || []).filter((s) => s?.id?.toString() === record?.levelId?.toString())
        return (
          <>{filter?.length && filter[0].name}</>
        )
      }
    },
    {
      title: t('dashboard.label.lesson'),
      dataIndex: 'lesson',
      render: (text, record) => {
        if (!record.lessons) return null
        return <span>{record?.lessons?.length} lessons</span>
      },
    },
    {
      title: t('dashboard.label.status'),
      dataIndex: 'published',
      render: (text, record, index) => {
        return (
          <span>
            {record.isPublished ? (
              <p className="text-white mb-1 font-weight-bold text-center p-1 mr-1" style={{background:'#F6C344'}}>
                {t('dashboard.label.published')}
              </p>
            ) : (
              <p className="text-white mb-1 font-weight-bold text-center p-1 mr-1" style={{background:'#FDB756'}}>
                {t('dashboard.label.no_published')}
              </p>
            )}
          </span>
        )
      },
    },
    {
      title: t('dashboard.label.actions'),
      dataIndex: 'actions',
      fixed: 'right',
      render: (item, record) => {
        return (
          <div className='d-flex align-items-center'>
            {record.isDeleted ? (
              <>
                <Tooltip title={t('dashboard.label.recycle_course')}>
                  <a onClick={() => {
                    confirm({
                      icon: <ExclamationCircleOutlined />,
                      content: t('dashboard.modal.are_you_sure_recycle_course'),
                      onOk() {
                        actions.handleRecycleCourse(record.id)
                      },
                    })
                  }} className="btn btn-xs btn-info mb-1" style={{marginRight:3}}>
                    <UndoOutlined style={{display:'inline-block',color:'#fff',verticalAlign:'middle',fontSize:15}}/>
                  </a>
                </Tooltip>
                <Tooltip title={t('dashboard.label.soft_delete_course')}>
                  <a onClick={() => {
                    confirm({
                      icon: <ExclamationCircleOutlined />,
                      content: t('dashboard.modal.are_you_sure_soft_course'),
                      onOk() {
                        actions.handleSoftDeleteCourse(record.id)
                      },
                    })
                  }} className="btn btn-xs btn-danger mb-1" style={{marginRight:3}}>
                    <DeleteFilled style={{display:'inline-block',color:'#fff',verticalAlign:'middle',fontSize:15}}/>
                  </a>
                </Tooltip>
                </>
            ) : (
              <>
                <Tooltip title={t('dashboard.label.view_course')}>
                  <a onClick={() => actions.getCourse(record.id)} className="btn btn-xs btn-primary mb-1" style={{marginRight:3}}>
                    <EyeFilled style={{display:'inline-block',verticalAlign:'middle',color:'#fff',fontSize:15}}/>
                  </a>
                </Tooltip>
                <Tooltip title={t('dashboard.label.edit_course')}>
                  <a onClick={()=>{actions.goTo(`${RouterConstants.DASHBOARD_COURSE.path}/${record.id}`)}} className="btn btn-xs btn-info mb-1" style={{marginRight:3}}>
                    <EditFilled style={{display:'inline-block',verticalAlign:'middle',color:'#fff',fontSize:15}}/>
                  </a>
                </Tooltip>
                <Tooltip title={t('dashboard.label.delete_course')}>
                  <a onClick={() => {
                    confirm({
                      icon: <ExclamationCircleOutlined />,
                      content: t('dashboard.modal.are_you_sure_delete'),
                      onOk() {
                        actions.handleDeleteCourse(record.id)
                      },
                    })
                  }} className="btn btn-xs btn-danger mb-1" style={{marginRight:3}}>
                    <DeleteFilled style={{display:'inline-block',color:'#fff',verticalAlign:'middle',fontSize:15}}/>
                  </a>
                </Tooltip>
                {record.isPublished ? (
                  <Tooltip title={t('dashboard.label.unpublish_course')}>
                    <a onClick={e => {
                      confirm({
                        icon: <ExclamationCircleOutlined />,
                        content: t('dashboard.modal.once_you_unpublish_your_course'),
                        onOk() {
                          actions.handleUpdateCourse({ id: record.id, field: 'isPublished', checked: false })
                        },
                      })
                    }} className='btn btn-xs btn-dark mb-1 pointer text-danger' style={{marginRight:3}}>
                      <CloseOutlined style={{display:'inline-block',verticalAlign:'middle',color:'#fff',fontSize:15}}/>
                    </a>
                  </Tooltip>
                ) : (
                  <Tooltip title={t('dashboard.label.publish_course')}>
                    <a onClick={e => {
                      confirm({
                        icon: <ExclamationCircleOutlined />,
                        content: t('dashboard.modal.once_you_publish_your_course'),
                        onOk() {
                          actions.handleUpdateCourse({ id: record.id, field: 'isPublished', checked: true })
                        },
                      })
                    }}  className='btn btn-xs btn-dark mb-1 pointer text-success' style={{marginRight:3}}>
                      <UpOutlined style={{display:'inline-block',verticalAlign:'middle',color:'#fff',fontSize:15}}/>
                    </a>
                  </Tooltip>
                )}
              </>
            )}
          </div>
        )
      },
    },
  ];

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };
  
  return (
    <Table
      rowSelection={{
        type: 'checkbox',
        ...rowSelection,
      }}
      columns={columns}
      dataSource={items}
      pagination={{ pageSize: 50 }}
    />
  )
}

export default ListCourseTable
