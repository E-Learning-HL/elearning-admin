import './index.less';
import React, {useRef, useState, useEffect} from 'react';

import {PageContainer, ProTable} from '@ant-design/pro-components';
import { Button, Tooltip, Modal, Input, Select, ConfigProvider } from 'antd';
import {PlusOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons';
import {getListContact, removeContact, getListProvince, getListDistrict} from './service';
import NProgress from 'nprogress';
import EditContactForm from './component/editForm'
import {FORM_TYPE} from '../../const/const'
import _ from 'lodash';
import {getListService} from "@/pages/doctor/service";
import viVnIntl from 'antd/lib/locale/vi_VN';


const Contact = () => {
  const actionRef = useRef();
  const [showDetail, setShowDetail] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false)
  const [debouncing, setDebouncing] = useState(false);
  const [dataIndex, setDataIndex] = useState(null)


  const onDelete = async (entity) => {
    NProgress.start();
    let res = await removeContact(entity.id);
    if (res) {
      actionRef?.current.reload();
    }
    NProgress.done();
  };


  useEffect(() => {
    async function fetchData() {
      const results = await Promise.all([
        getListProvince(),
        getListService()
      ]);

      setDataIndex({
        listProvince: results[0],
        listService: results[1],
      });
    }
    fetchData();
  }, []);


  const columns = [
    {
      title: 'Tên KH',
      dataIndex: 'customer_name',
      width: 200,
      render: (dom, entity) => {
        return (
          <div className="title">{entity.customer_name}</div>
        );
      },
      renderFormItem: (item, { type, defaultRender, fieldProps, ...rest }, form) => {
        const debounceOnChangeInput = _.debounce((event) => {
          form.submit();
          setDebouncing(false);
        }, 900);

        return (
          <Input
            placeholder="Nhập tên khách hàng"
            onChange={(event) => {
              event.persist();
              form.setFieldsValue({ customer_name: event.target.value });
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
      title: 'Số điện thoại',
      dataIndex: 'customer_phone_number',
      hideInSearch: true,
      width: 200,
      render: (dom, entity) => {
        return <div className="text-index">{dom}</div>;
      },
    },
    {
      title: 'Khu vực',
      dataIndex: 'province_id',
      // hideInSearch: true,
      width: 200,
      render: (dom, entity) => {
        return (
          <div className="text-index">{dataIndex.listProvince.data.find(x => x.id === dom).name}</div>
        )
      },
      renderFormItem: (item, { type, defaultRender, fieldProps, ...rest }, form) => {
        const debounceOnChangeInput = _.debounce((event) => {
          form.submit();
          setDebouncing(false);
        }, 900);

        return (
          <Select
            className='select-form-contact'
            style={{ width: '100%' }}
            showSearch
            placeholder="Chọn tỉnh thành"
            onChange={(event) => {
              form.setFieldsValue({province_id: event});
              setLoadingTable(true);
              if (!debouncing) {
                setDebouncing(true);
                if (event !== '') {
                  debounceOnChangeInput(event);
                } else {
                  form.submit();
                  setDebouncing(false);
                }
              }
            }}
          >
            {dataIndex &&
              dataIndex.listProvince &&
              dataIndex.listProvince.data.map((province) => {
                return (
                  <Option key={province.id} value={province.id}>
                    {province.name}
                  </Option>
                );
              })}
          </Select>
        );
      },
    },

    {
      title: 'Dịch vụ nha khoa',
      dataIndex: 'category_service_id',
      hideInSearch: true,
      width: 200,
      render: (dom, entity) => {
        return <div className="text-index">{dataIndex.listService.data.find(x => x.id === dom).name}</div>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'state',
      hideInSearch: true,
      width: 200,
      render: (dom, entity) => {
        return <div className="contact-state">
          <div className={dom}>
            {_.capitalize(dom)}
          </div>
        </div>;
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
                setCurrentRow({id: entity.id});
                setEditModalVisible(true);
              }}
            >
              <EditOutlined/>
            </div>
          </Tooltip>
          <Tooltip title="Xóa">
            <div className="wrapper-button-menu" onClick={() => onDelete(entity)}>
              <DeleteOutlined/>
            </div>
          </Tooltip>
        </div>
      ),
    },
  ]

  return (
    <PageContainer>
      <ConfigProvider locale={viVnIntl}>
        <ProTable
          actionRef={actionRef}
          rowKey="id"
          request={async (params) => {
            const listContact = await getListContact({ ...params });
            setLoadingTable(false);
            return listContact;
          }}
          columns={columns}
          className="wrapper-doctor"
          pagination={{
            defaultCurrent: 1,
            defaultPageSize: 10,
          }}
          search={{ resetText: 'Xóa bộ lọc' }}
          loading={loadingTable}
        />
      </ConfigProvider>
      <Modal
        title="Chỉnh sửa thông tin liên hệ"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          console.log(this);
        }}
        width={1000}
        footer={null}
        style={{ top: 20 }}
      >
        <EditContactForm
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
export default Contact;
