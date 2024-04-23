import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProTable, ProDescriptions } from '@ant-design/pro-components';
import { Button, Input, Modal, Tooltip, Drawer, ConfigProvider, Select } from 'antd';
import _ from 'lodash';
import NProgress from 'nprogress';
import { useEffect, useRef, useState } from 'react';
import { history, useLocation } from 'umi';
import { FORM_TYPE } from '../../const/const';
import CreateCategoryServiceForm from './form';
import './index.less';
import viVnIntl from 'antd/lib/locale/vi_VN';
import { getListRole, getListUser } from './service';

const CategoryService = () => {
  const actionRef = useRef();
  const [loadingTable, setLoadingTable] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [type_modal, setTypeModal] = useState('NEW');
  const [currentRow, setCurrentRow] = useState(null);
  const [debouncing, setDebouncing] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const listRole = ['SUPER_ADMIN', 'ADMIN', 'USER'];
  const status = {
    true: 'TRUE',
    false: 'FALSE',
  };
  const onDelete = async (entity) => {
    NProgress.start();
    let res = await removeService(entity.id);
    if (res) {
      actionRef?.current.reload();
    }
    NProgress.done();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getListRole();
        setListRole(result);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      // hideInSearch: true,
      render: (dom, entity) => {
        return (
          <div className="wrapper-first-column">
            <div className="wrapper-info">
              <a
                // onClick={() => {
                //   history.push(`/category-service?id=${entity?.id}`);
                //   setCurrentRow(entity);
                //   setShowDetail(true);
                // }}
                className="category-service-name"
              >
                {dom}
              </a>
            </div>
          </div>
        );
      },
      renderFormItem: (item, { type, defaultRender, fieldProps, ...rest }, form) => {
        const debounceOnChangeInput = _.debounce((event) => {
          form.submit();
          setDebouncing(false);
        }, 200);

        return (
          <Input
            style={{ width: '100%' }}
            placeholder="Nhập tên user"
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
      title: 'Email',
      dataIndex: 'email',
      width: 350,
      // hideInSearch: true,
      render: (dom, entity) => {
        return (
          <div className="wrapper-first-column">
            <div className="wrapper-info">
              <a
                // onClick={() => {
                //   history.push(`/category-service?id=${entity?.id}`);
                //   setCurrentRow(entity);
                //   setShowDetail(true);
                // }}
                className="category-service-name"
              >
                {dom}
              </a>
            </div>
          </div>
        );
      },
      // renderFormItem: (item, { type, defaultRender, fieldProps, ...rest }, form) => {
      //   const debounceOnChangeInput = _.debounce((event) => {
      //     form.submit();
      //     setDebouncing(false);
      //   }, 200);

      //   return (
      //     <Input
      //       placeholder="Nhập email"
      //       onChange={(event) => {
      //         event.persist();
      //         form.setFieldsValue({ name: event.target.value });
      //         setLoadingTable(true);

      //         if (!debouncing) {
      //           setDebouncing(true);

      //           if (event.target.value !== '') {
      //             debounceOnChangeInput(event);
      //           } else {
      //             form.submit();
      //             setDebouncing(false);
      //           }
      //         }
      //       }}
      //       allowClear
      //     />
      //   );
      // },
    },
    {
      title: 'Role',
      dataIndex: 'role',
      width: 150,
      // hideInSearch: true,
      render: (dom, entity) => {
        return (
          <div className="wrapper-first-column">
            <div className="wrapper-info">
              <a
                // onClick={() => {
                //   history.push(`/category-service?id=${entity?.id}`);
                //   setCurrentRow(entity);
                //   setShowDetail(true);
                // }}
                className="category-service-name"
              >
                {dom}
              </a>
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
          <Select
            className="select-form-contact"
            style={{ width: '100%' }}
            // filterOption={filterOption}
            placeholder="Chọn role"
            allowClear
            onChange={(event) => {
              form.setFieldsValue({ role: event });
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
            {listRole.map((item) => {
              return (
                <Option key={item} value={item}>
                  {item}
                </Option>
              );
            })}
          </Select>
        );
      },
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      render: (dom, entity) => {
        return (
          <div className="wrapper-first-column">
            <div className="wrapper-info">
              <a
                // onClick={() => {
                //   history.push(`/category-service?id=${entity?.id}`);
                //   setCurrentRow(entity);
                //   setShowDetail(true);
                // }}
                className="category-service-name"
              >
                {status[dom]}
              </a>
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
          <Select
            className="select-form-contact"
            style={{ width: '100%' }}
            // filterOption={filterOption}
            placeholder="Active"
            allowClear
            onChange={(event) => {
              form.setFieldsValue({ isActive: event });
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
            {[true, false].map((item) => {
              return (
                <Option key={item} value={item}>
                  {item}
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

      render: (_, entity) => {
        return (
          <div className="wrapper-operator">
            <Tooltip title="Chỉnh sửa">
              <div
                className="wrapper-button-menu"
                onClick={async () => {
                  setTypeModal('EDIT');
                  setCurrentRow({
                    name: entity.name,
                    id: entity.id,
                    email: entity.email,
                    role: entity.role,
                    active: entity.isActive,
                  });
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
        );
      },
    },
  ];

  const categoryServiceColumns = [
    {
      dataIndex: 'name',
      render: (_, entity) => {
        return (
          <div className="wrapper-detail-category-service">
            <div className="wp-block-name">
              <div className="block-title">Tên loại role</div>
              <div className="space"></div>
              <div className="block-value">{entity.name}</div>
            </div>
          </div>
        );
      },
    },
  ];

  let location = useLocation();
  useEffect(() => {
    const currentURL = location.search;
    const urlParams = new URLSearchParams(currentURL);
    const id = urlParams.get('id');
    if (id) {
      setCurrentRow({ id });
      setShowDetail(true);
    }
  }, []);

  return (
    <PageContainer>
      <ConfigProvider locale={viVnIntl}>
        <ProTable
          actionRef={actionRef}
          rowKey="id"
          request={async (params, sorter, filter) => {
            const listUser = await getListUser({ ...params, sorter, filter });
            setLoadingTable(false);
            return listUser;
          }}
          columns={columns}
          className="wrapper-category-service"
          pagination={{
            defaultCurrent: 1,
            defaultPageSize: 10,
          }}
          search={{ resetText: 'Xóa bộ lọc' }}
          loading={loadingTable}
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                setTypeModal('NEW');
                setEditModalVisible(true);
              }}
            >
              <PlusOutlined /> Thêm mới
            </Button>,
          ]}
        />
      </ConfigProvider>
      {/* <Drawer
        width={800}
        open={showDetail}
        onClose={() => {
          history.push(`/category-service`);
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow && (
          <ProDescriptions
            column={1}
            // title={currentRow?.name}
            request={() => getService(currentRow.id)}
            params={{
              id: currentRow?.id,
            }}
            columns={categoryServiceColumns}
          />
        )}
      </Drawer> */}
      <Modal
        transitionName=""
        maskTransitionName=""
        title={type_modal === FORM_TYPE.EDIT ? 'Chỉnh sửa user' : 'Tạo user mới'}
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setCurrentRow(null);
        }}
        width={1000}
        footer={null}
        style={{ top: 20 }}
        destroyOnClose={true}
        // motion={0}
      >
        {/* abc */}
        <CreateCategoryServiceForm
          data={listRole}
          type={type_modal}
          // role_id={currentRow?.role_id}
          role={currentRow?.role}
          email={currentRow?.email}
          active={currentRow?.active}
          id={currentRow?.id}
          name={currentRow?.name}
          onDone={() => {
            setEditModalVisible(false);
            actionRef?.current.reload();
          }}
        />
      </Modal>
    </PageContainer>
  );
};

export default CategoryService;
