import { LoadingOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Skeleton, message } from 'antd';
import { useEffect, useState } from 'react';
import { createService, editService } from './service';

const CreateCategoryServiceForm = (props) => {
  const [form] = Form.useForm();
  const [loadingPage, setLoadingPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const FormItem = Form.Item;

  const onFinish = async () => {
    setLoading(true);
    const fieldsValue = await form.validateFields();

    if (props.type === 'EDIT') {
      const result = await editService({ ...fieldsValue }, props.id);
      console.log('result', result);
      if (result.status === 200) {
        props.onDone();
      }
    } else {
      const result = await createService({ ...fieldsValue });
      if (result.status === 200) {
        form.resetFields();
      }
      if (props.type === 'NEW') {
        props.onDone();
      }
    }

    setLoading(false);
  };
  useEffect(() => {
    form.setFieldsValue({ name: props.type === 'EDIT' ? props.name : '' });
  }, []);

  const renderCreateForm = () => {
    return (
      <div>
        <Row>
          {/* Name */}
          <Col xs={24}>
            <FormItem
              label="Tên loại dịch vụ"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Bạn chưa nhập tên loại dịch vụ',
                },
              ]}
            >
              <Input placeholder="Ví dụ: Niềng răng Implant" />
            </FormItem>
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
            {props.type === 'EDIT' ? 'Chỉnh sửa' : 'Tạo mới'}
          </Button>
        </FormItem>
      </div>
    );
  };
  return (
    <div className="wrapper-create-category-service">
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
export default CreateCategoryServiceForm;
