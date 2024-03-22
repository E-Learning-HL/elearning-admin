import { useEffect, useState } from 'react';

import { LoadingOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Select, Skeleton, message, Cascader, Divider } from 'antd';
import { history } from 'umi';
import { strVNForSearch } from '../../../common/util';
import { createDoctor, editDoctor, getDoctor, getListService } from '../service';
import './index.less';

const { Option } = Select;
const FormItem = Form.Item;
const CreateDoctorForm = (props) => {
  const [form] = Form.useForm();
  const [loadingPage, setLoadingPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataCreate, setDataCreate] = useState(null);
  const [typeAssign, setTypeAssign] = useState(null);

  // Example data for course
  const courseOptions = [
    {
      value: 'zhejiang',
      label: 'Zhejiang',
    },
    {
      value: 'jiangsu',
      label: 'Jiangsu',
      children: [
        {
          value: 'nanjing',
          label: 'Nanjing',
          children: [
            {
              value: 'zhonghuamen',
              label: 'Zhong Hua Men',
            },
          ],
        },
      ],
    },
  ];

  const fillterOption = (input, option) => {
    if (option.props.value) {
      return strVNForSearch(option.props.children).includes(strVNForSearch(input));
    } else {
      return false;
    }
  };
  const onFinish = async () => {
    setLoading(true);
    const fieldsValue = await form.validateFields();
    const newImage = [{ link: fieldsValue.avatar, image_type: 'AVATAR' }];

    if (props.type === 'EDIT') {
      const result = await editDoctor({ ...fieldsValue }, props.id);
      if (result.status === 200) {
        props.onDone();
      }
    } else {
      const result = await createDoctor({ ...fieldsValue, images: newImage });
      if (result.status === 200) {
        form.resetFields();
        history.push('/doctor');
      }
      if (props.type === 'CREATE-CLINIC') {
        props.onDone(result.data.id);
      }
    }

    setLoading(false);
  };
  useEffect(() => {
    // async function fetchData() {
    //   const results = await Promise.all([getListService()]);
    //   setDataCreate(results[0]);
    // }
    // fetchData();
  }, []);
  useEffect(() => {
    async function fetchData() {
      if (props.id) {
        setLoadingPage(true);
        const dataEdit = await getDoctor(props.id);
        const newDataEdit = { ...dataEdit.data };
        const dataService = newDataEdit.doctor_service.map((item) => {
          return item.category_service?.id;
        });

        const dataImage = newDataEdit.image.map((item) => {
          return {
            link: item.link,
            image_type: item.image_type,
          };
        });

        form.setFieldsValue({
          ...newDataEdit,
          doctor_service: dataService,
          avatar: dataImage.find((item) => item.image_type === 'AVATAR').link,
        });

        setLoadingPage(false);
      }
    }
    fetchData();
  }, [props.id]);
  const renderCreateForm = () => {
    return (
      <div>
        <Row>
          {/* Name */}
          <Col xs={24}>
            <FormItem
              label="Tên Assignments"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Bạn chưa điền Assignments',
                },
              ]}
            >
              <Input placeholder="Ví dụ: Bài kiểm tra đầu vào" />
            </FormItem>
          </Col>
          {/* title */}
          <Col xs={24} xl={8} className="padding-right">
            <FormItem
              label="Loại Assignments"
              name="type-assign"
              rules={[
                {
                  required: true,
                  message: 'Bạn chưa chọn loại Assignments',
                },
              ]}
            >
              <Select
                placeholder="Chọn loại Assignments"
                onChange={(e) => {
                  setTypeAssign(e);
                  form.setFieldValue('type-exam', ['LISTENING', 'READING']);
                }}
                options={[
                  {
                    value: 'EXERCISES',
                    label: 'Exercises',
                  },
                  {
                    value: 'TESTS',
                    label: 'Tests',
                  },
                ]}
              />
            </FormItem>
          </Col>
          <Col xs={24} xl={8} className="padding-right">
            <FormItem
              label="Loại bài"
              name="type-exam"
              rules={[
                {
                  required: true,
                  message: 'Bạn chưa chọn loại bài',
                },
              ]}
            >
              <Select
                placeholder="Chọn loại bài"
                mode="multiple"
                disabled={typeAssign === 'TESTS' ? true : false}
                options={[
                  {
                    value: 'LISTENING',
                    label: 'Listening',
                  },
                  {
                    value: 'READING',
                    label: 'Reading',
                  },
                ]}
              />
            </FormItem>
          </Col>
          {/* Chọn khóa học */}
          <Col xs={24} xl={8} className="padding-right">
            <FormItem
              label="Chọn khóa học"
              name="course_location"
              rules={[
                {
                  required: true,
                  message: 'Bạn chưa chọn khóa học',
                },
              ]}
            >
              <Cascader
                options={courseOptions}
                placeholder="Chọn khóa học"
                disabled={typeAssign == null ? true : false}
              />
            </FormItem>
          </Col>
          <Divider />
          {/* Tạo bài nghe */}  
          <Col xs={24} xl={8}>
            <FormItem label="Năm kinh nghiệm" name="experience_time">
              <Input placeholder="Ví dụ: 24 năm" />
            </FormItem>
          </Col>
          {/* service */}
          <Col xs={24}>
            <Form.Item label="Dịch vụ" name={'doctor_service'} initialValue={[]}>
              <Select
                style={{
                  width: '100%',
                }}
                mode="multiple"
                showSearch
                filterOption={fillterOption}
                placeholder="Chọn Dịch vụ"
              >
                {dataCreate &&
                  dataCreate.data.map((doctor_service) => {
                    return (
                      <Option key={doctor_service.id} value={doctor_service.id}>
                        {doctor_service.name}
                      </Option>
                    );
                  })}
              </Select>
            </Form.Item>
          </Col>
          {/* Introduce */}
          <Col xs={24}>
            <Form.Item
              name="introduce"
              label="Giới thiệu chung về bác sĩ"
              style={{ width: '100%' }}
            >
              <Input.TextArea
                rows={6}
                placeholder={`Ví dụ: Bác sĩ Thái tốt nghiệp Bs CKII - Răng Hàm Mặt Trường Đại học Y Hà Nội. Với hơn 25 năm kinh nghiệm khám và điều trị các bệnh lý về nha khoa, bác sĩ Thái đã từng đảm nhận các vị trí quan trọng tại nhiều hệ thống hệ thống nha khoa lớn.

Ngoài ra, bác sĩ Thái còn được mời làm Đại diện cho thương hiệu Mytis Arrow Implant - một thương hiệu nổi tiếng về Implant của Nhật Bản`}
              />
            </Form.Item>
          </Col>
          {/* Education */}
          <Col xs={24}>
            <Form.Item name="education" label="Học vấn" style={{ width: '100%' }}>
              <Input.TextArea rows={6} />
            </Form.Item>
          </Col>
          {/* experience */}
          <Col xs={24}>
            <Form.Item
              name="work_experience"
              label="Kinh nghiệm làm việc"
              style={{ width: '100%' }}
            >
              <Input.TextArea rows={6} />
            </Form.Item>
          </Col>
        </Row>
        <FormItem className="wrapper-button-submit">
          <Button
            size="large"
            // loading={loading}
            type="primary"
            htmlType="submit"
            className="button-submit"
          >
            {loading && <LoadingOutlined />}
            {!loading && props.type !== 'EDIT' && <PlusSquareOutlined style={{ marginRight: 5 }} />}
            {props.type === 'EDIT' ? 'Chỉnh sửa thông tin' : <div>Tạo Assignments</div>}
          </Button>
        </FormItem>
      </div>
    );
  };
  return (
    <div className="wrapper-create-doctor">
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
    </div>
  );
};
export default CreateDoctorForm;
