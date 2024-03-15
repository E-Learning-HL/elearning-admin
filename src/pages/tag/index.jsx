import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProTable, ProDescriptions } from '@ant-design/pro-components';
import { Button, Input, Modal, Tooltip, Drawer, ConfigProvider } from 'antd';
import _ from 'lodash';
import NProgress from 'nprogress';
import { useEffect, useRef, useState } from 'react';
import { history, useLocation } from 'umi';
import { FORM_TYPE } from '../../const/const';
import CreateTagForm from './form';
import './index.less';
import { getListTag, getTag, removeTag } from './service';
import viVnIntl from 'antd/lib/locale/vi_VN';


const Tag = () => {
  const actionRef = useRef();
  const [loadingTable, setLoadingTable] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [type_modal, setTypeModal] = useState('NEW');
  const [currentRow, setCurrentRow] = useState(null);
  const [debouncing, setDebouncing] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const onDelete = async (entity) => {
    NProgress.start();
    let res = await removeTag(entity.id);
    if (res) {
      actionRef?.current.reload();
    }
    NProgress.done();
  };

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
                onClick={() => {
                  history.push(`/tag?id=${entity?.id}`);
                  setCurrentRow(entity);
                  setShowDetail(true);
                }}
                className="tag-name"
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
            placeholder="Nhập thẻ tag"
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
                setTypeModal('EDIT');
                setCurrentRow({ id: entity.id, name: entity.name });
                setEditModalVisible(true);
              }}
            >
              <EditOutlined />
            </div>
          </Tooltip>
          <Tooltip title="Xóa">
            <div className="wrapper-button-menu" onClick={() => onDelete(entity)}>
              <DeleteOutlined />
            </div>
          </Tooltip>
        </div>
      ),
    },
  ];

  const tagColumns = [
    {
      dataIndex: 'name',
      render: (_, entity) => {
        return (
          <div className="wrapper-detail-tag">
            <div className="wp-block-name">
              <div className="block-title">Tên thẻ</div>
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
            const listTag = await getListTag({ ...params, sorter, filter });
            setLoadingTable(false);
            return listTag;
          }}
          columns={columns}
          className="wrapper-tag"
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
              <PlusOutlined /> Thêm thẻ tag
            </Button>,
          ]}
        />
      </ConfigProvider>
      <Drawer
        width={800}
        open={showDetail}
        onClose={() => {
          history.push(`/tag`);
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow && (
          <ProDescriptions
            column={1}
            // title={currentRow?.name}
            request={() => getTag(currentRow.id)}
            params={{
              id: currentRow?.id,
            }}
            columns={tagColumns}
          />
        )}
      </Drawer>
      <Modal
        transitionName=""
        maskTransitionName=""
        title={type_modal === FORM_TYPE.EDIT ? 'Chỉnh sửa thông tin thẻ' : 'Tạo thẻ mới'}
        open={editModalVisible}
        onCancel={() => {
          console.log('dong');
          setEditModalVisible(false);
        }}
        width={1000}
        footer={null}
        style={{ top: 20 }}
        destroyOnClose
        // motion={0}
      >
        <CreateTagForm
          type={type_modal}
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

export default Tag;
