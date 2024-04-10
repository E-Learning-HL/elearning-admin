import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { Button, Col, Drawer, Modal, Row, Select, Table, Tooltip, ConfigProvider } from 'antd';
import NProgress from 'nprogress';
import { useEffect, useRef, useState } from 'react';
import iconMarkBlue from '../../assets/image/icon-mark-blue.svg';
import iconMark from '../../assets/image/icon-mark.svg';
import iconStar2 from '../../assets/image/icon-star-2.svg';
import iconStar from '../../assets/image/icon-star.svg';
import './index.less';
import { getClinic, getListCourse, removeClinic } from './service';

import iconCheck from '../../assets/image/icon-check.svg';

import { history, useLocation } from 'umi';
import iconDate from '../../assets/image/icon-date.svg';
import iconLocation from '../../assets/image/icon-location.svg';
import { formatWorkingDays, strVNForSearch } from '../../common/util';

import 'react-image-gallery/styles/css/image-gallery.css';

import CreateClinicForm from './component/createForm';

import { Input } from 'antd';
import _ from 'lodash';
import { FORM_TYPE, PREFIX_IMAGE_URL, IMAGE_TYPE } from '../../const/const';
import viVnIntl from 'antd/lib/locale/vi_VN';

import ImageCommon from '../../components/Image/image'

const { Option } = Select;

const Clinic = () => {
  const actionRef = useRef();
  const [showDetail, setShowDetail] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [indexServiceClinic, setIndexServiceClinic] = useState(0);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [debouncing, setDebouncing] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);

  const fillterOption = (input, option) => {
    if (option.props.value) {
      return strVNForSearch(option.props.children).includes(strVNForSearch(input));
    } else {
      return false;
    }
  };

  const status = {
    true: "Public",
    false: "Imported"
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'nameCourse',
      width: 500,
      render: (dom, entity) => {
        // const logo = entity?.image?.find((item) => item.image_type === IMAGE_TYPE.avatar);
        return (
          <div className="wrapper-first-column">
            {/* <img
              className="logo-clinic"
              src={cover?.key ? `${PREFIX_IMAGE_URL}${cover.key}` : defaultImage}
            /> */}
            <ImageCommon data={entity?.file[0]?.url} className="logo-clinic" />
            <div className="wrapper-info">
              <a
                onClick={() => {
                  history.push(`/clinic?id=${entity?.id}`);
                  setCurrentRow(entity);
                  setShowDetail(true);

                  //get list service
                }}
                className="clinic-name"
              >
                {dom}
              </a>
              {/* <div className="description">{entity.introduce}</div> */}
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
            placeholder="Nhập tên khóa học"
            onChange={(event) => {
              event.persist();
              form.setFieldsValue({ nameCourse: event.target.value });
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
      title: 'Status',
      dataIndex: 'isActive',
      width: 500,
      render: (dom, entity) => {
        // const logo = entity?.image?.find((item) => item.image_type === IMAGE_TYPE.avatar);
        return (
          <div className="wrapper-first-column">
            {/* <img
              className="logo-clinic"
              src={cover?.key ? `${PREFIX_IMAGE_URL}${cover.key}` : defaultImage}
            /> */}
            {/* <ImageCommon data={entity?.file[0]?.url} className="logo-clinic" /> */}
            <div className="wrapper-info">
                {status[dom]}
              {/* <div className="description">{entity.introduce}</div> */}
            </div>
          </div>
        );
      },
      // renderFormItem: (item, { type, defaultRender, fieldProps, ...rest }, form) => {
      //   const debounceOnChangeInput = _.debounce((event) => {
      //     form.submit();
      //     setDebouncing(false);
      //   }, 900);

      //   return (
      //     <Input
      //       placeholder="Nhập tên khóa học"
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
    // {
    //   title: 'Thời gian làm việc',
    //   dataIndex: 'time_start',
    //   hideInSearch: true,
    //   render: (dom, entity) => {
    //     return (
    //       <div>
    //         {entity.time_start} - {entity.time_end}
    //       </div>
    //     );
    //   },
    // },
    // {
    //   title: 'Chuyên Khoa',
    //   dataIndex: 'specialization',
    //   hideInSearch: true,
    //   render: (_, entity) => {
    //     const specialization_clinic = entity.specialization_clinic.map((item) => {
    //       return item.specialization.name;
    //     });
    //     return (
    //       <div>
    //         {specialization_clinic.map((i) => {
    //           return (
    //             <div className="specialization" key={i}>
    //               {i}
    //             </div>
    //           );
    //         })}
    //       </div>
    //     );
    //   },
    // },
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
          <Tooltip title="Xóa">
            <div className="wrapper-button-menu" onClick={() => onDelete(entity)}>
              <DeleteOutlined />
            </div>
          </Tooltip>
        </div>
      ),
    },
  ];
  const clinicColumns = [
    {
      // title: "Title",
      dataIndex: 'name',
      render: (_, entity) => {
        const specialization = entity.specialization_clinic.map((item) => {
          return item.specialization.name;
        });
        let specializationString = '';
        specialization.map((item, index) => {
          if (index) {
            specializationString += `, ${item}`;
          } else {
            specializationString += `${item}`;
          }
          return null;
        });

        const workday = entity.workday.map((item) => {
          return {
            id: item.weekday.id,
            name: item.weekday.name,
          };
        });
        const cover = entity?.image?.find((item) => item.image_type === IMAGE_TYPE.banner);
        const logo = entity?.image?.find((item) => item.image_type === IMAGE_TYPE.avatar);

        return (
          <div className="wrapper-detail-clinic">
            <div className="wrapper-header-block">
              {/* <img className="info-cover" src={entity?.cover}></img> */}
              <ImageCommon data={cover} className="info-cover" />
              <div className="wrapper-info">
                <div className="info-left">
                  <ImageCommon data={logo} className="info-logo" />
                  {/* <img className="info-logo" src={entity?.logo} /> */}
                </div>
                <div className="info-right">
                  <div className="title-name">{entity?.name}</div>
                  <div className="wp-line-info">
                    <img src={iconDate} className="icon-info" />
                    <div className="key-info">Ngày làm việc:</div>
                    <div className="value-info">
                      {workday.length > 0 ? formatWorkingDays(workday) : '_'}
                    </div>
                  </div>
                  <div className="wp-line-info">
                    <img src={iconLocation} className="icon-info" />
                    <div className="key-info">Địa chỉ:</div>
                    <div className="value-info">{entity?.address[0]?.detail_address}</div>
                  </div>
                </div>
              </div>

              <div className="wp-block-introduce">
                <div className="block-title">Giới thiệu phòng khám</div>
                <div className="space"></div>
                <div
                  className="block-value"
                  dangerouslySetInnerHTML={{ __html:  entity.introduce }}
                >
                </div>
              </div>

              <div className="wp-block-address">
                <div className="block-title">Danh sách số điện thoại</div>
                <div className="space"></div>
                <div className="block-value">
                  <ul>
                    {entity.phone.map((item) => {
                      return (
                        <li key={item?.phone_number}>
                          {item?.phone_number ? `${item.phone_number}` : null}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              <div className="wp-block-info">
                <div className="block-title">Thông tin phòng khám</div>
                <div className="space"></div>
                <div className="block-value">
                  <div className="wp-block-specialization">
                    <div className="wp-title-block">
                      <img src={iconMarkBlue} className="icon-title" />
                      Chuyên khoa:
                    </div>
                    <div className="wp-tag-block">
                      {entity.specialization_clinic.map((item) => {
                        return (
                          <div className="common-tag" key={item.specialization.name}>
                            {item.specialization.name}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="wp-block-specialization">
                    <div className="wp-title-block">
                      <img src={iconStar} className="icon-title" />
                      Dịch vụ nổi bật:
                    </div>
                    <div className="wp-tag-block">
                      {entity.category_service_clinic.map((item) => {
                        return (
                          <div className="common-tag" key={item.category_service?.name}>
                            {item.category_service?.name}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="wp-block-specialization">
                    <div className="wp-title-block">
                      <img src={iconCheck} className="icon-title" />
                      Tiện ích tại nha khoa:
                    </div>
                    <div className="wp-tag-block">
                      {entity.tag_clinic.map((item) => {
                        return (
                          <div className="common-tag" key={item.tag.name}>
                            {item.tag.name}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="wp-block-price">
                <div className="block-title">Bảng giá dịch vụ</div>
                <div className="space"></div>
                <div className="block-value">
                  <div className="wp-table-price">
                    {entity.category_service_clinic.map((item) => {
                      return (
                        <div key={item.category_service?.id}>
                          <div className="block-title">{item.category_service?.name}</div>
                          <Table
                            pagination={false}
                            dataSource={item.service}
                            columns={columnsService}
                          />
                          <br />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              {/* <div className="wp-block-image">
                <div className="block-title">Cơ sở vật chất</div>
                <div className="space"></div>
                <div className="block-value">
                  <ImageGallery items={imageClinic} />
                </div>
              </div> */}
              <div className="wp-block-doctor">
                <div className="block-title">Đội ngũ chuyên gia</div>
                <div className="space"></div>
                <div className="block-value">
                  <Row>
                    {entity.doctor.map((item) => {
                      let valueService = [];
                      if (item.doctor_service.length > 0) {
                        item.doctor_service.map((subItem) =>
                          valueService.push(subItem.category_service.name),
                        );
                      }
                      return (
                        <Col className="col-item-doctor" key={item.id} xl={8}>
                          <div className="item-doctor">
                            <img className="image-doctor" src={item.avatar} />
                            <div className="doctor-name">{item.name}</div>
                            <div className="doctor-title">{item.title}</div>
                            <div className="space-title"></div>
                            <div className="wp-line-doctor">
                              <img src={iconStar2} className="icon-star-doctor" />
                              <div className="name-line-doctor">Dịch vụ:</div>
                            </div>
                            <div className="value-line-doctor">{valueService.join(', ')}</div>
                            <div className="wp-line-doctor">
                              <img src={iconStar2} className="icon-star-doctor" />
                              <div className="name-line-doctor">Kinh nghiệm:</div>
                            </div>
                            <div className="value-line-doctor">{item.experience_time}</div>
                          </div>
                        </Col>
                      );
                    })}
                  </Row>
                </div>
              </div>
            </div>
          </div>
        );
      },
    },
  ];
  const columnsService = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      width: 250,
    },
    {
      title: 'Giá(VNĐ)',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: 'Bảo hành',
      dataIndex: 'guarantee',
      key: 'guarantee',
    },
  ];
  const onDelete = async (entity) => {
    NProgress.start();
    let res = await removeClinic(entity.id);
    if (res) {
      actionRef?.current.reload();
    }
    NProgress.done();
  };
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
          headerTitle="Khóa học"
          actionRef={actionRef}
          rowKey="id"
          request={async (params, sorter, filter) => {
            const listClinic = await getListCourse({ ...params, sorter, filter });
            setLoadingTable(false);
            return listClinic;
          }}
          columns={columns}
          className="wrapper-clinic"
          pagination={{
            defaultCurrent: 1,
            defaultPageSize: 10,
          }}
          search={{ resetText: 'Xóa bộ lọc' }}
          // search={true}
          loading={loadingTable}
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                history.push('/clinic/create');
              }}
            >
              <PlusOutlined /> Thêm khóa học
            </Button>,
          ]}
        />
      </ConfigProvider>
      <Drawer
        width={800}
        open={showDetail}
        onClose={() => {
          history.push(`/clinic`);
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
        destroyOnClose
      >
        {currentRow && (
          <ProDescriptions
            destroyOnClose
            column={1}
            // title={currentRow?.name}
            request={() => getClinic(currentRow.id)}
            params={{
              id: currentRow?.id,
            }}
            columns={clinicColumns}
          />
        )}
      </Drawer>
      <Modal
        transitionName=""
        maskTransitionName=""
        title="Chỉnh sửa khóa học"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
        }}
        width={1000}
        footer={null}
        style={{ top: 20 }}
        destroyOnClose={true}
        // motion={0}
      >
        <CreateClinicForm
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
export default Clinic;
