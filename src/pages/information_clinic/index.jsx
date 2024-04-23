import './index.less';
import React, { useRef, useState, useEffect } from 'react';

import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Tooltip, Modal, ConfigProvider, Select, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getListInformationClinic, removeInformationClinic, getListClinic } from './service';
import NProgress from 'nprogress';
import { history, useLocation } from 'umi';
import { FORM_TYPE } from '../../const/const';
import _ from 'lodash';
import { Input } from 'antd';
import CreateInformationClinicForm from '@/pages/information_clinic/component/createForm';
import viVnIntl from 'antd/lib/locale/vi_VN';

const InformationClinic = () => {
  const actionRef = useRef();
  const [showDetail, setShowDetail] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [debouncing, setDebouncing] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [dataClinic, setDataClinic] = useState(null);

  const onDelete = async (entity) => {
    NProgress.start();
    let res = await removeInformationClinic(entity.id);
    if (res) {
      actionRef?.current.reload();
    }
    NProgress.done();
  };

  // useEffect(() => {
  //   async function fetchData() {
  //     const results = await Promise.all([getListClinic()]);
  //     setDataClinic(results[0]);
  //   }
  //   fetchData();
  // }, []);

  const columns = [
    {
      title: 'Mã HD',
      dataIndex: 'id',
      hideInSearch: true,
      width: 90,
      render: (dom, entity) => {
        return <div className="introduce">{dom}</div>;
      },
    },
    {
      title: 'User',
      dataIndex: 'user',
      width: 200,
      // hideInSearch: true,
      render: (dom, entity) => {
        return <div className="title">{entity.user.email}</div>;
      },
      renderFormItem: (item, { type, defaultRender, fieldProps, ...rest }, form) => {
        const debounceOnChangeInput = _.debounce((event) => {
          form.submit();
          setDebouncing(false);
        }, 900);

        return (
          <Input
            placeholder="Nhập email"
            onChange={(event) => {
              event.persist();
              form.setFieldsValue({ name: event.target.value });
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
      title: 'Tổng tiền',
      dataIndex: 'amount',
      hideInSearch: true,
      width: 200,
      render: (dom, entity) => {
        return <div className="introduce">{parseFloat(dom).toLocaleString()}</div>;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'updatedAt',
      // hideInSearch: true,
      width: 200,
      render: (dom, entity) => {
        const date = new Date(dom);
        return (
          <div className="introduce">
            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
            {date.toLocaleDateString()}
          </div>
        );
      },
      renderFormItem: (item, { type, defaultRender, fieldProps, ...rest }, form) => {
        const debounceOnChangeInput = _.debounce((event) => {
          form.submit();
          setDebouncing(false);
        }, 900);

        return (
          <DatePicker placeholder='Chọn ngày tạo'/>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      // hideInSearch: true,
      width: 200,
      render: (dom, entity) => {
        return <div className="introduce">{dom}</div>;
      },
      renderFormItem: (item, { type, defaultRender, fieldProps, ...rest }, form) => {
        const debounceOnChangeInput = _.debounce((event) => {
          form.submit();
          setDebouncing(false);
        }, 900);

        return (
          <Select
            className="select-form-contact"
            // style={{ width: '80%' }}
            // showSearch
            // filterOption={filterOption}
            placeholder="Chọn trạng thái"
          >
            {[{ value: 'PENDING' }, { value: 'FAILED' }, { value: 'SUCCESS' }].map((item) => {
              return (
                <Option key={item.value} value={item.value}>
                  {item.value}
                </Option>
              );
            })}
          </Select>
        );
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
          {/* <Tooltip title="Xóa">
            <div className="wrapper-button-menu" onClick={() => onDelete(entity)}>
              <DeleteOutlined />
            </div>
          </Tooltip> */}
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <ConfigProvider locale={viVnIntl}>
        <ProTable
          actionRef={actionRef}
          rowKey="id"
          request={async (params, sorter, filter) => {
            console.log(123123123123);
            const listDoctor = await getListInformationClinic({ ...params, sorter, filter });
            setLoadingTable(false);
            console.log('listDoctor', listDoctor);
            return listDoctor;
          }}
          columns={columns}
          className="wrapper-information-clinic"
          pagination={{
            defaultCurrent: 1,
            defaultPageSize: 10,
          }}
          search={{ resetText: 'Xóa bộ lọc', defaultCollapsed: false }}
          loading={loadingTable}
          // search={false}
          // toolBarRender={() => [
          //   <Button
          //     type="primary"
          //     key="primary"
          //     onClick={() => {
          //       history.push('/information_clinic/create');
          //     }}
          //   >
          //     <PlusOutlined /> Thêm liên hệ
          //   </Button>,
          // ]}
        />
      </ConfigProvider>
      <Modal
        title="Chỉnh sửa thông order"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
        }}
        // width={1000}
        footer={null}
        style={{ top: 20 }}
      >
        <CreateInformationClinicForm
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
export default InformationClinic;
