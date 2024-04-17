import './index.less';
import React, { useRef, useState, useEffect } from 'react';

import { PageContainer, ProTable, ProDescriptions } from '@ant-design/pro-components';
import { Button, Tooltip, Drawer, Modal, ConfigProvider, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getListAssign, deleteAssigment, getDoctor } from './service';
import NProgress from 'nprogress';
import { history, useLocation } from 'umi';
import iconExperience from '../../assets/image/icon-shield-done.png';
import iconService from '../../assets/image/icon-service.png';
import CreateDoctorForm from './component/createForm';
import { FORM_TYPE } from '../../const/const';
import _ from 'lodash';
import { Input } from 'antd';
import viVnIntl from 'antd/lib/locale/vi_VN';

const Doctor = () => {
  const actionRef = useRef();
  const [showDetail, setShowDetail] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [debouncing, setDebouncing] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const onDelete = async (entity) => {
    NProgress.start();
    let res = await deleteAssigment(entity.id);
    if (res) {
      actionRef?.current.reload();
    }
    NProgress.done();
  };
  const columns = [
    {
      title: 'Tên',
      dataIndex: 'nameAssignment',
      width: 300,
      // hideInSearch: true,
      render: (dom, entity) => {
        return (
          <div className="wrapper-first-column">
            {/* <img className="logo-clinic" src={entity.avatar} /> */}
            <div className="wrapper-info">
              <a
                onClick={() => {
                  history.push(`/doctor?id=${entity?.id}`);
                  setCurrentRow(entity);
                  setShowDetail(true);
                }}
                className="clinic-name"
              >
                {dom}
              </a>
              <div className="title">{entity.title}</div>
            </div>
          </div>
        );
      },
      renderFormItem: (item, { type, defaultRender, fieldProps, ...rest }, form) => {
        const debounceOnChangeInput = _.debounce((event) => {
          form.submit();
          setDebouncing(false);
        }, 900);

        return (
          <Input
            placeholder="Nhập tên Assignments"
            onChange={(event) => {
              event.persist();
              form.setFieldsValue({ nameAssignment: event.target.value });
              setLoadingTable(true);
              if (!debouncing) {
                setDebouncing(true);
                if (event.target.value !== '') {
                  debounceOnChangeInput(event);
                } else {
                  form.submit();
                  setDebouncing(false);
                }
              }
            }}
            allowClear
          />
        );
      },
    },

    {
      title: 'Loại Assigment',
      dataIndex: 'assignmentType',
      hideInSearch: true,
      render: (dom, entity) => {
        return <div className="introduce">{dom}</div>;
      },
    },
    {
      title: 'Điều khiển',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      align: 'center',
      width: 120,

      render: (_, entity) => (
        <div className="wrapper-operator">
          <Tooltip title="Chỉnh sửa">
            <div
              className="wrapper-button-menu"
              onClick={async () => {
                setCurrentRow({ id: entity.id });
                setEditModalVisible(true);
              }}
            >
              <EditOutlined />
            </div>
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc chắn xóa không?"
            placement="topRight"
            onConfirm={() => {
              onDelete(entity);
            }}
            okText="Ok"
            cancelText="Hủy"
          >
            <Tooltip>
              <div className="wrapper-button-menu">
                <DeleteOutlined />
              </div>
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];
  const doctorColumns = [
    {
      dataIndex: 'name',
      render: (_, entity) => {
        const service = entity.doctor_service.map((item) => {
          return item.category_service.name;
        });
        let serviceString = '';
        service.map((item, index) => {
          if (index) {
            serviceString += `, ${item}`;
          } else {
            serviceString += `${item}`;
          }
          return null;
        });
        return (
          <div className="wrapper-detail-doctor">
            <div className="wp-block-info">
              <img src={entity?.avatar} className="avatar"></img>
              <div className="wp-info-right">
                <div className="doctor-name">{entity.name}</div>
                <div className="doctor-title">{entity.title}</div>
                <div className="doctor-experience">
                  <img className="icon-experience" src={iconExperience} />
                  <div className="title-experience">Kinh nghiệm: </div>
                  <div className="title-value">{entity.experience_time}</div>
                </div>
                <div className="doctor-experience">
                  <img className="icon-experience" src={iconService} />
                  <div className="title-experience">Dịch vụ: </div>
                  <div className="title-value">{serviceString}</div>
                </div>
              </div>
            </div>
            <div className="wp-block-introduce">
              <div className="block-title">Giới thiệu chung về bác sĩ</div>
              <div className="space"></div>
              <div className="block-value">{entity.introduce}</div>
            </div>
            <div className="wp-block-introduce">
              <div className="block-title">Học vấn</div>
              <div className="space"></div>
              <div className="block-value">{entity.education}</div>
            </div>
            <div className="wp-block-introduce">
              <div className="block-title">Kinh nghiệm làm việc</div>
              <div className="space"></div>
              <div className="block-value">{entity.education}</div>
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <ConfigProvider locale={viVnIntl}>
        <ProTable
          actionRef={actionRef}
          rowKey="id"
          request={async (params, sorter, filter) => {
            const listDoctor = await getListAssign({ ...params, sorter, filter });
            setLoadingTable(false);
            return listDoctor;
          }}
          columns={columns}
          className="wrapper-doctor"
          pagination={{
            defaultCurrent: 1,
            defaultPageSize: 10,
          }}
          search={{ resetText: 'Xóa bộ lọc' }}
          loading={loadingTable}
          // search={false}
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                history.push('/assignment/create');
              }}
            >
              <PlusOutlined /> Thêm Assignments
            </Button>,
          ]}
        />
      </ConfigProvider>
      <Drawer
        width={800}
        open={showDetail}
        onClose={() => {
          history.push(`/doctor`);
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow && (
          <ProDescriptions
            column={1}
            // title={currentRow?.name}
            request={() => getDoctor(currentRow.id)}
            params={{
              id: currentRow?.id,
            }}
            columns={doctorColumns}
          />
        )}
      </Drawer>
      <Modal
        title="Chỉnh sửa thông tin Assignments"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
        }}
        width={1000}
        footer={null}
        style={{ top: 20 }}
        destroyOnClose={true}
      >
        <CreateDoctorForm
          type={FORM_TYPE.EDIT}
          id={currentRow?.id}
          onDone={() => {
            setEditModalVisible(false);
            actionRef?.current.reload();
          }}
        />
      </Modal>
    </PageContainer>
  );
};
export default Doctor;
