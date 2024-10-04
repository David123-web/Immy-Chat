import { DeleteFilled, EditFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import { Table, Tooltip, Modal } from 'antd';
import React from 'react';
import { useTranslation } from 'next-i18next';

const { confirm } = Modal;

const ListCourseTagsTable = ({ items, actions }) => {
  const { t } = useTranslation()

  const columns = [
    {
      title: t('dashboard.label.name'),
      dataIndex: 'name',
      render: (item, record) => {
        return (
          <div className='d-flex align-items-center'>
            {record.name ? <span className='tw-ml-2' style={{ backgroundColor: record.hexColor || 'transparent', borderRadius: 4, padding: '2px 5px' }}>{record.name || '-'}</span> : null}
          </div>
        )
      },
    },
    {
      title: t('dashboard.label.description'),
      dataIndex: 'description',
    },
    {
      title: t('dashboard.label.connections'),
      dataIndex: 'connections',
      render: (item, record) => {
        return <span style={{width:'100%',textAlign:'center'}}>{record.connections || '-'}</span>
      },
    },
    {
      title: t('dashboard.label.actions'), 
      dataIndex: '',
      render: (text, record, index) => {
        return (
          <div className='d-flex align-items-center'>
            <Tooltip title={t('dashboard.button.edit')}>
              <a
                onClick={() => actions.handleEditCourseTag(record)}
                className="btn btn-xs mb-1"
                style={{marginRight:3,background:'#4AD991'}}
              >
                <EditFilled style={{display:'inline-block',color:'#fff',verticalAlign:'middle',fontSize:15}}/>
              </a>
            </Tooltip>
            <Tooltip title={t('dashboard.button.delete')}>
              <a
                onClick={() => {
                  confirm({
                    icon: <ExclamationCircleOutlined />,
                    content: t('dashboard.modal.are_you_sure_delete'),
                    onOk() {
                      actions.handleDeleteCourseTag(record.id)
                    },
                  })
                }}
                className="btn btn-xs mb-1"
                style={{marginRight:3,background:'#E77470'}}
              >
                <DeleteFilled style={{display:'inline-block',color:'#fff',verticalAlign:'middle',fontSize:15}}/>
              </a>
            </Tooltip>
          </div>
        )
      }
    }
  ]

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

  return(
    <Table
      rowSelection={{
        type: 'checkbox',
        ...rowSelection,
      }}
      columns={columns}
      dataSource={(items || []).map((item, index) => {
        return {
          index: index + 1,
          id: item.id,
          name: item.name,
          hexColor: item.hexColor,
          description: item.description,
          connections: item?._count?.courses
        }
      })}
      pagination={{ pageSize: 50 }}
    />
  )
}

export default ListCourseTagsTable