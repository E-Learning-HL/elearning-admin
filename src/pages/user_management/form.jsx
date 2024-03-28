import { LoadingOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Skeleton, message, Card, Collapse, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { Select } from 'antd';
import { ProCard, ProFormSwitch } from '@ant-design/pro-components';
import { updateUser, createNewUser } from './service';
import { getListClinic } from './service';
import {strVNForSearch} from "@/common/util";
const { Panel } = Collapse;

const CreateCategoryServiceForm = (props) => {
  console.log('proppp', props);
  const [form] = Form.useForm();
  const [switchForm] = Form.useForm();
  const [loadingPage, setLoadingPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isClinic, setIsClinic] = useState(false);
  const [listClinic, setListClinic] = useState([]);
  const FormItem = Form.Item;

  const filterOption = (input, option) => {
    if (option.props.value) {
      return strVNForSearch(option.props.children).includes(strVNForSearch(input));
    } else {
      return false;
    }
  };

  const onFinish = async () => {
    setLoading(true);
    const fieldValue = await form.validateFields();

    const body = {
      name: fieldValue.name,
      email: fieldValue.email,
      password: fieldValue.password,
      role_id: fieldValue.role_id,
      clinic_ids : fieldValue.clinic_id
    };

    if (props.type === 'EDIT') {
      const result = await updateUser(props.id, body);
      if (result?.email === body.email) {
        props.onDone();
      }
    } else {
      const result = await createNewUser(body);
      if (result?.email === body.email) {
        props.onDone();
        // form.resetFields();
      }
      // if (props.type === 'NEW') {
      // props.onDone();
      // }
    }

    setLoading(false);
  };

  // Check lại phần này 

  // useEffect(() => {
  //   async function fetch() {
  //     setLoadingPage(true)
  //     const result = await getListClinic();
  //     setListClinic(result);
  //     const clinics = props?.clinics?.map((item) => item.id)
  //     form.setFieldsValue({ name: props.type === 'EDIT' ? props.name : '' });
  //     form.setFieldsValue({ role_id: props.type === 'EDIT' ? props.role_id : null });
  //     form.setFieldsValue({ email: props.type === 'EDIT' ? props.email : '' });
  //     form.setFieldsValue({clinic_id: props.type === 'EDIT'? clinics : null})
  //     if(props?.role_name === 'CLINIC')
  //       setIsClinic(true)
  //   }
  //   fetch();
  //   setLoadingPage(false);
  // }, []);

  const renderCreateForm = (data) => {
    return (
      <div>
        <Row>
          {/* Name */}
          <Col xs={24}>
            <FormItem
              style={{ marginBottom: '10px' }}
              label="Nhập tên"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Bạn chưa nhập tên User',
                },
              ]}
            >
              <Input placeholder="Ví dụ: Nha khoa Oze" />
            </FormItem>
          </Col>
          <Col xs={24}>
            <FormItem
              style={{ marginBottom: '10px' }}
              label="Nhập email"
              name="email"
              rules={[
                {
                  required: true,
                  type: 'email',
                  message: 'Invalid email!',
                },
              ]}
            >
              <Input placeholder="Ví dụ: admin@nhakhoaoze.vn" />
            </FormItem>
          </Col>
          <Col xs={24}>
            <FormItem
              style={{ marginBottom: '10px' }}
              // label="Mật khẩu"
              label={props.type === 'EDIT' ? 'Mật khẩu mới' : 'Mật khẩu'}
              name="password"
              rules={[
                {
                  required: props.type === 'EDIT' ? false : true,
                  message: '',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (props.type === 'EDIT') {
                      return Promise.resolve();
                    } else {
                      if (value.length > 5) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu phải chứa ít nhất 6 kí tự!'));
                    }
                  },
                }),
              ]}
            >
              <Input.Password />
            </FormItem>
          </Col>
          <Col xs={24}>
            <FormItem
              style={{ marginBottom: '10px' }}
              label={props.type === 'EDIT' ? 'Nhập lại mật khẩu mới' : 'Nhập lại mật khẩu'}
              name="confirm_password"
              rules={[
                {
                  required: props.type === 'EDIT' ? false : true,
                  message: '',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (props.type === 'EDIT') {
                      return Promise.resolve();
                    } else {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu không khớp!'));
                    }
                  },
                }),
              ]}
            >
              <Input.Password />
            </FormItem>
          </Col>
          <Col xs={24}>
            <FormItem
              style={{ marginBottom: '10px' }}
              label="Chọn role"
              name="role_id"
              rules={[
                {
                  required: true,
                  message: 'Bạn chưa chọn Role',
                },
              ]}
            >
              <Select
                className="select-form-contact"
                style={{ width: '100%' }}
                placeholder="Chọn role"
                onChange={(value, obj) => {
                  if (obj?.children === 'CLINIC')
                    //Role can display Clinic box
                    setIsClinic(true);
                  else setIsClinic(false);
                }}
              >
                {data &&
                  data.map((item) => {
                    return (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    );
                  })}
              </Select>
            </FormItem>
          </Col>
          {isClinic && (
            <Col xs={24}>
              <FormItem
                style={{ marginBottom: '10px' }}
                label="Chọn phòng khám"
                name="clinic_id"
                rules={[
                  {
                    required: true,
                    message: 'Bạn chưa chọn phòng khám',
                  },
                ]}
              >
                <Select
                  className="select-form-contact"
                  mode='multiple'
                  showSearch
                  filterOption={filterOption}
                  style={{ width: '100%' }}
                  placeholder="Chọn phòng khám"
                >
                  {listClinic &&
                    listClinic?.data?.map((item) => {
                      return (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      );
                    })}
                </Select>
              </FormItem>
            </Col>
          )}
        </Row>

        <FormItem className="wrapper-button-submit">
          <Button
            size="large"
            // loading={loading}
            type="primary"
            htmlType="submit"
            className="button-submit"
            // onClick={() => handleCreate()}
          >
            {loading && <LoadingOutlined />}
            {!loading && props.type !== 'EDIT' && <PlusSquareOutlined style={{ marginRight: 5 }} />}
            {props.type === 'EDIT' ? 'Chỉnh sửa' : 'Tạo mới'}
          </Button>
        </FormItem>
      </div>
    );
  };
  return (
    <div className="wrapper-create-role">
      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={() => {
          message.error('Kiểm tra lại Thông tin đăng bài!');
        }}
        layout={'vertical'}
      >
        {loadingPage ? <Skeleton /> : renderCreateForm(props.data)}
      </Form>
    </div>
  );
};
export default CreateCategoryServiceForm;
