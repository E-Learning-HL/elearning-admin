import { useEffect, useState } from 'react';

import { LoadingOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Select, Skeleton, message } from 'antd';
import { history } from 'umi';
import { strVNForSearch } from '../../../common/util';
import {
  editInformationPayment
} from '../service';
import './index.less';
import { getListProvince, getListService } from '@/pages/contact/service';

const { Option } = Select;
const FormItem = Form.Item;
const CreateInformationClinicForm = (props) => {
  const [form] = Form.useForm();
  const [loadingPage, setLoadingPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataClinic, setDataClinic] = useState(null);

  const onFinish = async () => {
    setLoading(true);
    const fieldsValue = await form.validateFields();
    if (props.type === 'EDIT') {
      const result = await editInformationPayment({ ...fieldsValue }, props.id);
      if (result.statusCode === 200) {
        props.onDone();
      }
    } else {
      // const result = await createInformationClinic({ ...fieldsValue });
      // if (result.status === 200) {
      //   form.resetFields();
      //   history.push('/information_clinic');
      // }
      // if (props.type === 'CREATE-CLINIC') {
      //   props.onDone(result.data.id);
      // }
    }

    setLoading(false);
  };

  // useEffect(() => {
  //   async function fetchData() {
  //     if (props.id) {
  //       setLoadingPage(true);
  //       const dataEdit = await getInformationClinic(props.id);
  //       const newDataEdit = { ...dataEdit.data };
  //       form.setFieldsValue({
  //         ...newDataEdit
  //       });
  //       setLoadingPage(false);
  //     }
  //   }
  //   fetchData();
  // }, [props.id]);
  const renderCreateForm = () => {
    return (
      <div className={'edit-contact'}>
        <Row>
          {/* <Col xs={12}>
            <FormItem
              name="name"
              label="User Name"
              rules={[
                {
                  required: true,
                  message: 'Bạn chưa nhập tên',
                },
              ]}
            >
              <Input placeholder="Họ và tên" disabled/>
            </FormItem>
          </Col>
          <Col xs={12}>
            <FormItem
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: 'Bạn chưa nhập tên',
                },
              ]}
            >
              <Input placeholder="Email" disabled/>
            </FormItem>
          </Col>
          <Col xs={12}>
            <FormItem
              // style={{marginBottom: 16, marginRight: 8}}
              name="amount"
              label="Tổng tiền"
              rules={[
                {
                  required: true,
                  message: 'Bạn chưa nhập tổng tiền',
                },
              ]}
            >
              <Input placeholder="VD: 0989777543"/>
            </FormItem>
          </Col> */}
          <Col xs={24}>
            <FormItem
              style={{marginBottom: 16, marginRight: 8}}
              name="status"
              label="Trạng thái"
              rules={[
                {
                  required: true,
                  message: 'Bạn chưa chọn trạng thái',
                },
              ]}
            >
              <Select
                className='select-form-contact'
                style={{ width: '100%' }}
                // showSearch
                // filterOption={filterOption}
                placeholder="Chọn trạng thái"
              >
                {[{value: "PENDING"},{value: "FAILED"},{value: "SUCCESS"}].map((item) => {
                    return (
                      <Option key={item.value} value={item.value}>
                        {item.value}
                      </Option>
                    );
                  })}
              </Select>
            </FormItem>
          </Col>

          {/* <Col xs={12}>
            <FormItem
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: 'Bạn chưa nhập email',
                },
              ]}
            >
              <Input placeholder="VD: abc@gmail.com" />
            </FormItem>
          </Col> */}
        </Row>
        <FormItem className="wrapper-button-submit">
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            className="submit-btn-edit-contact"
            // onClick={onSubmit}
          >
            {loading && <LoadingOutlined />}
            {!loading && props.type !== 'EDIT'}
            {props.type === 'EDIT' ? 'Chỉnh sửa thông tin' : <div>Tạo thông tin liên hệ</div>}
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
export default CreateInformationClinicForm;
