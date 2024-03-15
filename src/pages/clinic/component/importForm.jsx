import { COPILOT_QUESION } from '@/const/const';
import { Button, Col, Form, Input, Row, Skeleton } from 'antd';
import { useEffect } from 'react';
import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const { TextArea } = Input;
const FormItem = Form.Item;
const CreateImportForm = (props) => {
  const [form] = Form.useForm();
  const [loadingPage, setLoadingPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [website, setWebsite] = useState(null);

  const onFinish = async () => {
    setLoading(true);
    try {
      let data_list = {};
      const fieldsValue = await form.validateFields();
      delete fieldsValue.website;
      for (let key in fieldsValue) {
        data_list[key] = JSON.parse("[" + fieldsValue[key] + "]").flat(Infinity)
      }
      form.setFields([{ name: "errors", errors: [] }]);

      props.onDone(data_list);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      form.setFields([{ name: "errors", errors: ['Data import syntax error'] }]);
    }
  };
  useEffect(() => {
    form.setFieldsValue({
      website: props.website,
    });
    setWebsite(props.website);
  }, [])
  const renderImportForm = () => {
    return (
      <div>
        <Row className="modal-csv">
          <Col xs={24}>
            <FormItem label="Link website nha khoa" name="website">
              <TextArea
                className="text-anwser"
                rows={1}
                placeholder="https://nhakhoahub.com"
                onChange={(text) => {
                  setWebsite(text.target.value);
                }}
              />
            </FormItem>
          </Col>
          <Col xs={24}>
            <CopyToClipboard text={COPILOT_QUESION.specialization(website)}>
              <Button className="button-copy-quesion" type="dashed" block>
                copy
              </Button>
            </CopyToClipboard>
            <FormItem label="Danh sách chuyên khoa" name="specialization" initialValue={[]}>
              <TextArea
                className="text-anwser"
                rows={4}
                placeholder="Paste data text csv"
              />
            </FormItem>
          </Col>
          <Col xs={24}>
            <CopyToClipboard text={COPILOT_QUESION.services(website)}>
              <Button className="button-copy-quesion" type="dashed" block>
                copy
              </Button>
            </CopyToClipboard>
            <FormItem label="Danh sách dịch vụ và giá" name="category_services" initialValue={[]}>
              <TextArea className="text-anwser" rows={4} placeholder="Paste data text csv" />
            </FormItem>
          </Col>
          {/* <Col xs={24}>
            <CopyToClipboard text={COPILOT_QUESION.address(website)}>
              <Button className="button-copy-quesion" type="dashed" block>
                copy
              </Button>
            </CopyToClipboard>
            <FormItem label="Danh sách cơ sở :" name="address" initialValue={[]}>
              <TextArea
                className="text-anwser"
                rows={4}
                placeholder="Paste data text csv"
              />
            </FormItem>
          </Col> */}
          <Col xs={24}>
            <CopyToClipboard text={COPILOT_QUESION.phone(website)}>
              <Button className="button-copy-quesion" type="dashed" block>
                copy
              </Button>
            </CopyToClipboard>
            <FormItem label="Số điện thoại:" name="phone" initialValue={[]}>
              <TextArea
                className="text-anwser"
                rows={4}
                placeholder="Paste data text csv"
              />
            </FormItem>
          </Col>
          {/* <Col xs={12}> */}
          {/* <CopyToClipboard text={COPILOT_QUESION.workday(website)}>
              <Button className="button-copy-quesion" type="dashed" block>
                copy
              </Button>
            </CopyToClipboard>
            <FormItem label="Lịch làm việc" name="workday">
              <TextArea
                className="text-anwser"
                rows={4}
                placeholder="Paste data text csv"
                initialValue={[]}
              />
            </FormItem> */}
          {/* </Col> */}
          <FormItem label="" name="errors" initialValue={""}>
          </FormItem>
        </Row>
        <FormItem className="wrapper-button-submit">
          <Button
            size="large"
            loading={loading}
            type="primary"
            htmlType="submit"
            className="button-submit"
          >
            Thêm dữ liệu
          </Button>
        </FormItem>
      </div>
    );
  };
  return (
    <div className="wrapper-create-import">
      <Form
        form={form}
        onFinish={onFinish}
        // onFinishFailed={() => {
        //   message.error('Kiểm tra lại Thông tin đăng bài!');
        // }}
        layout={'vertical'}
      >
        {loadingPage ? <Skeleton /> : renderImportForm()}
      </Form>
    </div>
  );
};
export default CreateImportForm;
