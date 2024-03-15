import {
  CloseOutlined,
  LoadingOutlined,
  PlusSquareOutlined,
  AntDesignOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { history } from '@umijs/max';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Skeleton,
  TimePicker,
  message,
  Upload,
  Avatar,
  Image,
} from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { strVNForSearch, toSlug } from '../../../common/util';
import { DEFAULT_LIST_WEEKDAY } from '../../../const/const';
import CreateDoctorForm from '../../doctor/component/createForm';
import {
  createClinic,
  getClinic,
  getListDistrict,
  getListDoctor,
  getListProvince,
  getListService,
  getListSpecialization,
  getListTag,
  getListImage,
  updateClinic,
} from '../service';

import CreateImportForm from './importForm';
import './index.less';
import _ from 'lodash';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const { Option } = Select;
const FormItem = Form.Item;
const getNewBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
const normFile3 = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList3;
};
const CreateClinicForm = (props) => {
  const [form] = Form.useForm();
  const [loadingPage, setLoadingPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataCreate, setDataCreate] = useState([]);
  const [dataCreateDoctor, setDataCreateDoctor] = useState([]);
  const [temptDataCreateDoctor, setTemptDataCreateDoctor] = useState([]);
  const [districts, setDistricts] = useState([[]]);
  const [createDoctorModalVisible, setCreateDoctorModalVisible] = useState(false);
  const [dataCsv, setdataCSV] = useState(false);
  const [idDotorCreate, setIdDotorCreate] = useState(null);
  const [dataServiceCopilot, setDataServiceCopilot] = useState([]);
  const [website, setWebsite] = useState(null)

  const fillterOption = (input, option) => {
    if (option.props.value) {
      return strVNForSearch(option.props.children).includes(strVNForSearch(input));
    } else {
      return false;
    }
  };
  useEffect(() => {
    async function fetchData() {
      setLoadingPage(true);
      const results = await Promise.all([
        getListSpecialization(),
        getListProvince(),
        getListService(),
        getListTag(),
        getListDoctor(props.id),
        getListImage(props.id),
      ]);
      console.log('results', results[5]);
      setDataCreate({
        listProvine: results[1],
        listSpecialization: results[0],
        listService: results[2],
        listTag: results[3],
        // listDoctor: results[4],
        listImage: results[5],
      });
      setDataCreateDoctor(results[4].data.data);
      setLoadingPage(false);
    }
    form.setFieldsValue({ time: [moment('8:00', 'HH:mm'), moment('20:00', 'HH:mm')] });
    fetchData();
  }, []);

  //handle import csv
  useEffect(() => {
    // specialization
    if (dataServiceCopilot.specialization !== undefined) {
      try {
        const specialization_clinic = [];
        dataCreate.listSpecialization.data.map((item) =>
          dataServiceCopilot.specialization.filter((subItem) => {
            if (subItem.name === item.name) {
              specialization_clinic.push(item.id);
            }
            return specialization_clinic;
          }),
        );
        if (specialization_clinic.length > 0) {
          form.setFieldValue('specialization', specialization_clinic);
        }
        form.setFields([{ name: "errors", errors: [] }]);
      } catch (e) {
        form.setFields([{ name: "specialization", errors: ['Data import error'] }]);
      }
    }

    // phone
    if (dataServiceCopilot.phone !== undefined) {
      try {
        const dataPhone = dataServiceCopilot.phone.map((item) => {
          return { phone_number: item.phone_number };
        });
        if (dataPhone.length > 0) {
          form.setFieldValue('phone', dataPhone);
        }
        form.setFields([{ name: "errors", errors: [] }]);
      } catch (e) {
        form.setFields([{ name: "phone", errors: ['Data import error'] }]);
      }
    }

    // services
    if (dataServiceCopilot.category_services !== undefined) {
      try {
        const dataCategoryService = [];
        console.log('category_services', dataServiceCopilot.category_services);
        dataCreate.listService.data.map((item) =>
          dataServiceCopilot.category_services.filter((subItem) => {
            const dataService = [];
            if (subItem.name === item.name) {
              subItem.service.map((element) =>
                dataService.push({
                  name: element.name,
                  amount: element.amount,
                  unit: element.unit,
                  guarantee: element.guarantee,
                }),
              );
              dataCategoryService.push({
                category_service_id: item.id,
                service: dataService,
              });
            }
            return dataCategoryService;
          }),
        );
        console.log('dataCategoryService.length', dataCategoryService.length);
        if (dataCategoryService.length > 0) {
          form.setFieldValue('category_service_clinic', dataCategoryService);
        }
        form.setFields([{ name: "errors", errors: [] }]);
      } catch (e) {
        form.setFields([{ name: "category_service_clinic", errors: ['Data import error'] }]);
      }
    }

    // list_address
    if (dataServiceCopilot.address !== undefined && dataServiceCopilot.address[0]) {
      try {
        const newDistrits = [];
        const dataAddress = [];
        const address_copilot = dataServiceCopilot.address[0]

        dataCreate.listProvine.data.map(async (item) => {
          if (item.name.includes(address_copilot.province)) {
            const list_district = await getListDistrict(item.id);
            const district = list_district.data.find((district) =>
              district.name.includes(address_copilot.district),
            );
            newDistrits.push(list_district.data);
            setDistricts(newDistrits);
            dataAddress.push({
              province: item?.id,
              district: district?.id,
              name: address_copilot?.detail_address,
            });
            console.log('dataAddress', dataAddress);
            form.setFieldValue('list_address', dataAddress);
            form.setFields([{ name: "errors", errors: [] }]);
          }
        });
      } catch (e) {
        form.setFields([{ name: "list_address", errors: ['Data import error'] }]);
      }
    }
    // [TODO] workday
  }, [dataServiceCopilot]);

  //handle after create doctor
  useEffect(() => {
    async function fetchData() {
      if (idDotorCreate) {
        const listDoctor = await getListDoctor(props.id);

        // form.setFieldValue('doctor', !work);
        // setDataCreate({
        //   ...dataCreate,
        //   listDoctor,
        // });

        setDataCreateDoctor(listDoctor.data.data);

        let doctor = form.getFieldValue('doctor');
        if (doctor !== undefined) {
          doctor.push(idDotorCreate);
          form.setFieldValue('doctor', doctor);
        } else {
          form.setFieldValue('doctor', [idDotorCreate]);
        }
        form.validateFields(['doctor']);
      }
    }
    fetchData();
  }, [idDotorCreate]);

  //handle in edit clinic
  useEffect(() => {
    async function fetchData() {
      if (props.id) {
        setLoadingPage(true);
        const dataEdit = await getClinic(props.id);
        setWebsite(dataEdit?.data?.website);
        const newDataEdit = { ...dataEdit.data };
        const dataWorkday = DEFAULT_LIST_WEEKDAY.map((item, index) => {
          const workday = newDataEdit.workday.find((element) => element.weekday.id - 2 === index);
          if (workday) {
            return { work: true };
          }
          return { work: false };
        });
        const dataPhone = newDataEdit.phone.map((item) => {
          return { phone_number: item.phone_number, id: item.id };
        });

        const dataSpecialization = newDataEdit.specialization_clinic.map((item) => {
          return item.specialization.id;
        });
        const updateListDoctorCreate = newDataEdit.doctor.map((item) => {
          return { id: item.id, name: item.name };
        });
        setTemptDataCreateDoctor(updateListDoctorCreate);

        const newDistrits = [];
        await Promise.all(
          newDataEdit.address.map(async (item) => {
            if (item.province !== null) {
              const district = await getListDistrict(item.province?.id);
              newDistrits.push(district.data);
              return {
                province: item.province.id,
                district: item.district?.id,
                name: item?.detail_address,
                latitude: item?.latitude,
                longitude: item?.longitude,
              };
            } else {
              return {};
            }
          }),
        );
        setDistricts(newDistrits);
        
        const dataAddress = newDataEdit.address.map((item) => {
          console.log('item?.latitude', item);
          return {
            province: item.province?.id,
            district: item.district?.id,
            name: item?.detail_address,
            id: item.id,
            latitude: item?.latitude,
            longitude: item?.longitude,
          };
        });

        const dataCategoryServiceClinic = newDataEdit.category_service_clinic.map((item) => {
          const dataService = item.service.map((element) => {
            return {
              name: element.name,
              amount: element.amount,
              unit: element.unit,
              guarantee: element.guarantee,
              id: element.id
            };
          });
          return { category_service_id: item.category_service?.id, service: dataService, id: item.id };
        });

        const dataTag = newDataEdit.tag_clinic.map((item) => {
          return item.tag.id;
        });

        const listImage = await getListImage(props.id);
        const dataImage = listImage?.data ? listImage?.data?.map((item) => {
          return {
            link: item?.link,
            image_type: item?.image_type,
            id: item?.id
          };
        }) : [];

        // Set url s3 show view
        // setFileBanner(dataImage.find((item) => item.image_type === 'BANNER')?.link);
        // setFileList(dataImage.filter((item) => item.image_type === 'INTRODUCE'));
        const dataDoctor = newDataEdit.doctor.map((item) => {
          return item.id;
        });

        const dataTime = [
          moment(newDataEdit.time_start ? newDataEdit.time_start : '08:00', 'HH:mm'),
          moment(newDataEdit.time_end ? newDataEdit.time_end : '20:00', 'HH:mm'),
        ];

        const dataLogo = dataImage.find((item) => item.image_type === 'AVATAR')
        const dataImageIntroduce = dataImage.filter((item) => item.image_type === 'INTRODUCE');
        const dataCover = dataImage.find((item) => item.image_type === 'BANNER');


        form.setFieldsValue({
          ...newDataEdit,
          time: dataTime,
          weekday: dataWorkday,
          phone: dataPhone,
          specialization: dataSpecialization,
          list_address: dataAddress,
          category_service_clinic: dataCategoryServiceClinic,
          tag: dataTag,
          // logo: dataImage.find((item) => item.image_type === 'AVATAR')?.link,
          logo: dataLogo
            ? [
              {
                uid: dataLogo.id,
                name: 'Hình ảnh',
                status: 'done',
                url: dataLogo?.link,
              },
            ]
            : [],
          logoId: dataLogo?.id,
          cover: dataCover
            ? [
              {
                uid: dataCover.id,
                name: 'Hình ảnh',
                status: 'done',
                url: dataCover?.link,
              },
            ]
            : [],
          coverId: dataCover?.id,
          image_introduce: dataImageIntroduce
            ? dataImageIntroduce.map((item) => {
              return {
                uid: item.id,
                name: 'Hình ảnh',
                status: 'done',
                url: item?.link,
              };
            })
            : [],
          doctor: dataDoctor,
        });

        setLoadingPage(false);
      }
    }
    fetchData();
  }, [props.id]);

  useEffect(() => {
    if (temptDataCreateDoctor.length > 0) {
      const finalDataCreateDoctor = temptDataCreateDoctor.concat([...dataCreateDoctor]);
      setTemptDataCreateDoctor([]);
      setDataCreateDoctor(finalDataCreateDoctor);
    }
  }, [dataCreateDoctor]);

  // upload Image introduce
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
      
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const onPreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getNewBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const debounceOnChangeInputName = _.debounce((event) => {
    form.setFieldsValue({ slug: toSlug(event) });
  }, 300);
  const renderCreateForm = () => {
    return (
      <div>
        <Row>
          <Col xs={24}>
            <Button
              className="button-add-csv"
              type="dashed"
              onClick={() => {
                setdataCSV(true);
              }}
            >
              + CSV
            </Button>
          </Col>
          <br />
          <br />
          {/* Name */}
          <Col xs={12} className="padding-right">
            <FormItem
              label="Tên Nha khoa"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Bạn chưa điền Tên Nha khoa',
                },
              ]}
            >
              <Input
                placeholder="Ví dụ: Nha Khoa Hải Anh"
                onChange={(event) => {
                  event.persist();
                  debounceOnChangeInputName(event.target.value);
                }}
              />
            </FormItem>
          </Col>
          {/* Slug */}
          <Col xs={12}>
            <FormItem
              label="Slug"
              name="slug"
              rules={[
                {
                  required: true,
                  message: 'Bạn chưa điền slug',
                },
              ]}
            >
              <Input placeholder="Ví dụ: nha-khoa-hai-anh" />
            </FormItem>
          </Col>

          {/* Logo */}
          <Col xs={24} xl={12} className="padding-right">
            <FormItem
              label="Logo Nha khoa"
              name="logo"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload
                listType="picture"
                maxCount={1}
                beforeUpload={beforeUpload}
                onChange={() => {
                  form.setFieldsValue({ logoId: undefined });
                }}
                onPreview={onPreview}
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </FormItem>
          </Col>
          {/* Cover */}
          <Col xs={24} xl={12}>
            {/* <Image name="banner_url" width={263} height={100} src={fileBanner} /> */}
            <FormItem
              label="Ảnh Bìa"
              name="cover"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload
                listType="picture"
                maxCount={1}
                beforeUpload={beforeUpload}
                // onChange={handleChangeBanner}
                onChange={() => {
                  form.setFieldsValue({ coverId: undefined });
                }}
                onPreview={onPreview}
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </FormItem>
          </Col>
          {/* Introduce */}
          <Col xs={24} xl={24}>
            <FormItem
              label="Thêm Ảnh giới thiệu"
              name="image_introduce"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload
                // action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                listType="picture-card"
                // fileList={fileList}
                // onChange={onChange}
                onPreview={onPreview}
              >
                + Upload
              </Upload>
            </FormItem>
          </Col>
          <Divider />
          {/* Time */}
          <Col xs={24} lg={8}>
            <FormItem
              label="Thời gian hoạt động"
              name="time"
              rules={[
                {
                  required: true,
                  message: 'Bạn chưa xác lập thời gian hoạt động',
                },
              ]}
            >
              <TimePicker.RangePicker format="HH:mm" minuteStep={15} />
            </FormItem>
          </Col>
          {/* Weekday */}
          <Col xs={24} lg={16}>
            <div>Ngày hoạt động</div>
            <Form.List
              name="weekday"
              initialValue={[
                { work: true },
                { work: true },
                { work: true },
                { work: true },
                { work: true },
                { work: false },
                { work: false },
              ]}
            >
              {(fields, { add, remove }) => (
                <div className="wp-weekday">
                  {fields.map((field) => {
                    return (
                      <Form.Item
                        key={field.key}
                        valuePropName="checked"
                        // label="Quận huyện"
                        name={[field.name, 'work']}
                      >
                        <Checkbox
                          onClick={() => {
                            // console.log('click')
                            // let work = form.getFieldValue(['weekday', field.key, 'work'])
                            // form.setFieldValue(['weekday', field.key, 'work'], !work)
                            // work = form.getFieldValue(['weekday', field.key, 'work'])
                          }}
                          // defaultChecked={form.getFieldValue(['weekday', field.key, 'work']) ? true : false}
                        >
                          {' '}
                          {field.key < 6 ? `T${field.key + 2}` : 'CN'}{' '}
                        </Checkbox>
                      </Form.Item>
                    );
                  })}
                </div>
              )}
            </Form.List>
          </Col>
          {/* Phone number */}
          <Col xs={24} lg={8}>
            <Form.List name="phone" initialValue={[{}]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <div key={field.key} className="item-phone-number">
                      <Form.Item
                        label={`Số điện thoại ${field.name + 1}`}
                        name={[field.name, 'phone_number']}
                        rules={[
                          {
                            pattern: new RegExp(/^[0-9+]*$/),
                            message: 'Số điện thoại bị sai!',
                          },
                        ]}
                        style={{ marginBottom: 15, width: '100%' }}
                      >
                        <Input placeholder="Ví dụ: 0971472894" maxLength={13} />
                      </Form.Item>
                      <div className="wp-item-remove-phone">
                        <CloseOutlined
                          onClick={() => {
                            remove(field.name);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <Button className="button-add-phone" type="dashed" onClick={() => add()} block>
                    + Thêm số điện thoại
                  </Button>
                </>
              )}
            </Form.List>
          </Col>
          {/* Address */}
          <Col xs={24}>
            <Form.List name="list_address" initialValue={[{}]}>
              {(fields, {}) => (
                <>
                  {fields.map((field, index) => (
                    <Card
                      size="small"
                      title="Địa chỉ"
                      key={field.key}
                      // extra={
                      //   <CloseOutlined
                      //     onClick={() => {
                      //       remove(field.name);
                      //     }}
                      //   />
                      // }
                      style={{ marginBottom: 10 }}
                    >
                      <Row>
                        <Col xs={24} xl={6} className="padding-right">
                          <Form.Item label="Tỉnh / Thành phố" name={[field.name, 'province']}>
                            <Select
                              style={{
                                width: '100%',
                              }}
                              showSearch
                              filterOption={fillterOption}
                              placeholder="Chọn Tỉnh/ Thành Phố"
                              onChange={async (value) => {
                                form.setFieldValue(
                                  ['list_address', field.key, 'district'],
                                  undefined,
                                );
                                // form.setFieldsValue({ list_address:  })
                                const district = await getListDistrict(value);
                                const newDistrict = [...districts];
                                newDistrict.splice(index, 1, district.data);
                                setDistricts(newDistrict);
                                // console.log(districts);
                              }}
                            >
                              {dataCreate &&
                                dataCreate.listProvine &&
                                dataCreate.listProvine.data.map((province) => {
                                  return (
                                    <Option key={province.id} value={province.id}>
                                      {province.name}
                                    </Option>
                                  );
                                })}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col xs={24} xl={6} className="padding-right">
                          <Form.Item label="Quận huyện" name={[field.name, 'district']}>
                            <Select
                              style={{
                                width: '100%',
                              }}
                              showSearch
                              filterOption={fillterOption}
                              placeholder="Chọn Quận / Huyện"
                              // onChange={async (value) => {
                              // }}
                            >
                              {districts &&
                                districts[index] &&
                                districts[index].map((district) => {
                                  return (
                                    <Option key={district.id} value={district.id}>
                                      {district.name}
                                    </Option>
                                  );
                                })}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col xs={24} xl={12}>
                          <Form.Item label="Địa chỉ cụ thể" name={[field.name, 'name']}>
                            <Input placeholder="Ví dụ: 112 Mễ Trì Hạ" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} xl={6} className="padding-right">
                          <Form.Item label="Latitude" name={[field.name, 'latitude']}>
                            <Input placeholder="Ví dụ: 21.0103779" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} xl={6} className="padding-right">
                          <Form.Item label="Longitude" name={[field.name, 'longitude']}>
                            <Input placeholder="Ví dụ: 105.7820266" />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                  {/* <Button
                    className="button-add-address"
                    type="dashed"
                    onClick={() => {
                      add();
                      const newDistrict = [...districts];
                      newDistrict.push([]);
                      setDistricts(newDistrict);
                    }}
                    block
                  >
                    + Thêm cơ sở
                  </Button> */}
                </>
              )}
            </Form.List>
          </Col>
          {/* Introduce */}
          <Col xs={24} style={{ marginTop: 15 }}>
            <Form.Item
              name="introduce"
              label="Giới thiệu"
              style={{ width: '100%' }}
              initialValue={''}
            >
              {/* <Input.TextArea rows={6} /> */}
              <ReactQuill
                theme="snow"
                modules={{
                  toolbar: [
                    [{ header: [1, 2, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                    [{ color: [] }, { background: [] }],
                    ['clean'],
                  ],
                }}
                formats={[
                  'header',
                  'bold',
                  'italic',
                  'underline',
                  'strike',
                  'list',
                  'bullet',
                  'indent',

                  'color',
                  'background',
                ]}
              />
            </Form.Item>
          </Col>

          {/* Specialization */}
          <Col xs={24}>
            <Form.Item label="Chuyên khoa" name={'specialization'} initialValue={[]}>
              <Select
                style={{
                  width: '100%',
                }}
                mode="multiple"
                showSearch
                filterOption={fillterOption}
                placeholder="Chọn Chuyên khoa"
              >
                {dataCreate &&
                  dataCreate.listSpecialization &&
                  dataCreate.listSpecialization.data.map((specialization) => {
                    return (
                      <Option key={specialization.id} value={specialization.id}>
                        {specialization.name}
                      </Option>
                    );
                  })}
              </Select>
            </Form.Item>
          </Col>
          {/* Tag */}
          <Col xs={24}>
            <Form.Item label="Tiện ích" name={'tag'} initialValue={[]}>
              <Select
                style={{
                  width: '100%',
                }}
                mode="multiple"
                showSearch
                filterOption={fillterOption}
                placeholder="Chọn Tiện ích"
              >
                {dataCreate &&
                  dataCreate.listTag &&
                  dataCreate.listTag.data.map((tag) => {
                    return (
                      <Option key={tag.id} value={tag.id}>
                        {tag.name}
                      </Option>
                    );
                  })}
              </Select>
            </Form.Item>
          </Col>
          <Divider />
          {/* Service */}
          <Col xs={24} style={{ marginBottom: 15 }}>
            <Form.List name="category_service_clinic" initialValue={[{}]}>
              {(fields, { add, remove }) => (
                <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}>
                  {fields.map((field) => (
                    <Card
                      size="small"
                      title={`Dịch vụ ${field.name + 1}`}
                      key={field.key}
                      extra={
                        <CloseOutlined
                          onClick={() => {
                            remove(field.name);
                          }}
                        />
                      }
                    >
                      <Form.Item
                        label="Dịch vụ"
                        name={[field.name, 'category_service_id']}
                        rules={[
                          {
                            required: false,
                            message: 'Bạn chưa chọn Dịch vụ',
                          },
                        ]}
                      >
                        <Select
                          style={{
                            width: '91%',
                          }}
                          showSearch
                          filterOption={fillterOption}
                          placeholder="Chọn Dịch vụ"
                        >
                          {dataCreate &&
                            dataCreate.listService &&
                            dataCreate.listService.data.map((service) => {
                              return (
                                <Option key={service.id} value={service.id}>
                                  {service.name}
                                </Option>
                              );
                            })}
                        </Select>
                      </Form.Item>

                      <Form.Item>
                        <Form.List name={[field.name, 'service']} initialValue={[{}]}>
                          {(subFields, subOpt) => (
                            <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
                              {subFields.map((subField) => (
                                <Row key={subField.key} className="row-service">
                                  <Col xs={24} xl={6} className="padding-right">
                                    <Form.Item
                                      label="Tên dịch vụ"
                                      name={[subField.name, 'name']}
                                      rules={[
                                        {
                                          required: false,
                                          message: 'Bạn chưa điền Tên dịch vụ',
                                        },
                                      ]}
                                    >
                                      <Input placeholder="Ví dụ: Trồng răng Implant" />
                                    </Form.Item>
                                  </Col>
                                  <Col xs={24} xl={6} className="padding-right">
                                    <Form.Item label="Giá" name={[subField.name, 'amount']}>
                                      <Input type="number" placeholder="Ví dụ: 800,000" />
                                    </Form.Item>
                                  </Col>
                                  <Col xs={24} xl={4} className="padding-right">
                                    <Form.Item label="Đơn vị" name={[subField.name, 'unit']}>
                                      <Input placeholder="Ví dụ: 1 Răng" />
                                    </Form.Item>
                                  </Col>
                                  <Col xs={24} xl={6} className="padding-right">
                                    <Form.Item label="Bảo hành" name={[subField.name, 'guarantee']}>
                                      <Input placeholder="Ví dụ: 8 Năm" />
                                    </Form.Item>
                                  </Col>
                                  <CloseOutlined
                                    onClick={() => {
                                      subOpt.remove(subField.name);
                                    }}
                                  />
                                </Row>
                              ))}
                              <Button
                                className="button-add"
                                type="dashed"
                                onClick={() => subOpt.add()}
                                block
                              >
                                + Thêm dòng
                              </Button>
                            </div>
                          )}
                        </Form.List>
                      </Form.Item>
                    </Card>
                  ))}

                  <Button type="dashed" onClick={() => add()} block>
                    + Loại dịch vụ
                  </Button>
                </div>
              )}
            </Form.List>
          </Col>

          {/* Doctor */}
          <Col xs={24}>
            <Form.Item label="Bác sĩ" name={'doctor'} initialValue={[]}>
              <Select
                style={{
                  width: '100%',
                }}
                mode="multiple"
                showSearch
                filterOption={fillterOption}
                placeholder="Chọn Bác sĩ"
              >
                {dataCreateDoctor &&
                  dataCreateDoctor.map((doctor) => {
                    return (
                      <Option key={doctor.id} value={doctor.id}>
                        {doctor.name}
                      </Option>
                    );
                  })}
              </Select>
            </Form.Item>
            {/* <Button
              className="button-add-doctor"
              type="dashed"
              onClick={() => {
                setCreateDoctorModalVisible(true);
              }}
            >
              + Tạo Bác sĩ
            </Button> */}
          </Col>
        </Row>
        <FormItem className="wrapper-button-submit">
          <Button
            size="large"
            // loading={loading}
            type="primary"
            htmlType="submit"
            className="button-submit"
            onClick={onSubmit}
          >
            {loading && <LoadingOutlined />}
            {!loading && props.type !== 'EDIT' && <PlusSquareOutlined style={{ marginRight: 5 }} />}
            {props.type !== 'EDIT' ? <div>Tạo Phòng Khám</div> : 'Sửa Phòng khám'}
          </Button>
        </FormItem>
      </div>
    );
  };

  const onSubmit = async () => {
    setLoading(true);
    // const fieldsValue = await form.validateFields();
    // console.log(fieldsValue);
  };

  const onFinish = async () => {
    setLoading(true);
    const fieldsValue = await form.validateFields();
    console.log('fieldsValue', fieldsValue);
    const time_start = moment(fieldsValue.time[0])?.format('HH:mm');
    const time_end = moment(fieldsValue.time[1])?.format('HH:mm');

    if (!fieldsValue.image_introduce) {
      fieldsValue.image_introduce = []
    }

    const introduceImage = await Promise.all(fieldsValue.image_introduce.map(async (item) => {
      if (item?.originFileObj) {
        item.dataBase64 = await getNewBase64(item?.originFileObj);
      }
      return {
        link: item,
        image_type: 'INTRODUCE',
        id: item.url ? item.uid : undefined,
      };
    }));
    console.log('introduceImage', introduceImage);
    let dataFieldsValueLogo = {}
    if (fieldsValue.logo && fieldsValue.logo[0]) {
      if (fieldsValue.logo[0]?.originFileObj) {
        fieldsValue.logo[0].dataBase64 = await getNewBase64(
          fieldsValue.logo[0]?.originFileObj,
        );
      }
      dataFieldsValueLogo = fieldsValue.logo[0];
    }

    let dataFieldsValueCover = {};
    if (fieldsValue.cover && fieldsValue.cover[0]) {
      if (fieldsValue.cover[0]?.originFileObj) {
        fieldsValue.cover[0].dataBase64 = await getNewBase64(fieldsValue.cover[0]?.originFileObj);
      }
      dataFieldsValueCover = fieldsValue.cover[0];
    }


    const newImage = [
      { link: dataFieldsValueLogo, image_type: 'AVATAR', id: form.getFieldValue('logoId') },
      { link: dataFieldsValueCover, image_type: 'BANNER', id: form.getFieldValue('coverId') },
      ...introduceImage,
    ];

    console.log('newImage', newImage);

    if (props.type === 'EDIT') {
      const result = await updateClinic(
        { ...fieldsValue, time_start, time_end, images: newImage },
        props.id,
      );
      if (result.status === 200) {
        props.onDone();
      }
    } else {
      const result = await createClinic({ ...fieldsValue, time_start, time_end, images: newImage });
      if (result.status === 200) {
        form.resetFields();
        history.push('/clinic');
      }
    }

    setLoading(false);
  };

  return (
    <div className="wrapper-create-clinic">
      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={() => {
          message.error('Kiểm tra lại Thông tin đăng bài!');
        }}
        layout={'vertical'}
      >
        {loadingPage ? <Skeleton /> : renderCreateForm()}
      </Form>
      <Modal
        title="Tạo bác sĩ"
        visible={createDoctorModalVisible}
        // onOk={handleOk}
        className="create-doctor-modal"
        onCancel={() => {
          setCreateDoctorModalVisible(false);
        }}
        width={1000}
        footer={null}
        style={{ top: 20 }}
      >
        <CreateDoctorForm
          type="CREATE-CLINIC"
          onDone={(id) => {
            setIdDotorCreate(id);
            setCreateDoctorModalVisible(false);
          }}
        />
      </Modal>
      <Modal
        title="CSV"
        visible={dataCsv}
        // onOk={handleOk}
        className="create-import-modal"
        onCancel={() => {
          setdataCSV(false);
        }}
        width={1000}
        footer={null}
        style={{ top: 20 }}
      >
        <CreateImportForm
          type="CREATE-IMPORT"
          onDone={(data) => {
            setdataCSV(false);
            setDataServiceCopilot(data);
          }}
          website={website}
        />
      </Modal>
      <Modal
        open={previewOpen}
        title={'Xem ảnh'}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img
          alt="example"
          style={{
            width: '100%',
          }}
          src={previewImage}
        />
      </Modal>
    </div>
  );
};
export default CreateClinicForm;
