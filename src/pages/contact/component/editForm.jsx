import { Button, Form, Row, Col, Input, Select, Skeleton, message } from 'antd';
import { useEffect, useState } from 'react';
import { strVNForSearch } from '@/common/util';
import { getListDistrict, getListProvince, getListService, getListClinic, editContact, getContact
} from '../service';
import './index.less';

const { Option } = Select;
const FormItem = Form.Item;
const EditContactForm = (props) => {
  const [form] = Form.useForm();
  const [loadingPage, setLoadingPage] = useState(false);
  const [dataCreate, setDataCreate] = useState([]);
  const [districts, setDistricts] = useState([]);

  const filterOption = (input, option) => {
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
        getListProvince(),
        getListService(),
        getListClinic()
      ]);

      setDataCreate({
        listProvince: results[0],
        listService: results[1],
        listClinic: results[2],
      });
      setLoadingPage(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (props.id) {
        setLoadingPage(true);
        const dataEdit = await getContact(props.id);
        const newDataEdit = { ...dataEdit.data };
        const dataClinic = newDataEdit.contact_clinic.map((item) => {
          return item.clinic?.id;
        });
        const districts = await getListDistrict(newDataEdit.province_id);
        setDistricts(districts.data);

        form.setFieldsValue({
          ...newDataEdit,
          contact_clinic: dataClinic
        });

        setLoadingPage(false);
      }
    }
    fetchData();
  }, [props.id]);

  const renderEditForm = () => {
    return (
      <div className={"edit-contact"}>
        <Row>
          <Col xs={12}>
            <FormItem
              style={{ marginBottom: 16, marginRight: 8 }}
              name="customer_name"
              label="Tên khách hàng"
              rules={[
                {
                  required: true,
                  message: 'Bạn chưa nhập tên',
                },
              ]}
            >
              <Input className="input-form-contact" placeholder="Họ và tên" />
            </FormItem>
          </Col>
          <Col xs={12}>
            <FormItem
              name="customer_phone_number"
              label="Số điện thoại"
              rules={[
                {
                  required: true,
                  message: 'Bạn chưa nhập số điện thoại',
                },
              ]}
            >
              <Input className="input-form-contact" placeholder="Số điện thoại" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <FormItem
              style={{ marginBottom: 16, marginRight: 8 }}
              name="email"
              label="Email"
            >
              <Input className="input-form-contact" placeholder="Email" />
            </FormItem>
          </Col>
          <Col xs={12}>
            <FormItem
              name="province_id"
              label="Tỉnh / Thành phố"
              rules={[
                {
                  required: true,
                  message: 'Bạn chưa chọn tỉnh/thành',
                },
              ]}
            >
              <Select
                className='select-form-contact'
                style={{ width: '100%' }}
                showSearch
                filterOption={filterOption}
                placeholder="Chọn tỉnh thành"
                onChange={async (value) => {
                  const districts = await getListDistrict(value);
                  setDistricts(districts.data);
                }}
              >
                {dataCreate &&
                  dataCreate.listProvince &&
                  dataCreate.listProvince.data.map((province) => {
                    return (
                      <Option key={province.id} value={province.id}>
                        {province.name}
                      </Option>
                    );
                  })}
              </Select>
            </FormItem>
          </Col>
          <Col xs={12}>
            <Form.Item
              style={{ marginBottom: 16, marginRight: 8 }}
              name= "district_id"
              label="Quận / Huyện"
              rules={[
                {
                  required: true,
                  message: 'Bạn chưa chọn quận/huyện',
                },
              ]}
            >
              <Select
                className='select-form-contact'
                style={{
                  width: '100%',
                }}
                showSearch
                filterOption={filterOption}
                placeholder="Chọn quận huyện"
              >
                {districts &&
                  districts.map((district) => {
                    return (
                      <Option key={district.id} value={district.id}>
                        {district.name}
                      </Option>
                    );
                  })}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12}>
            <FormItem
              name="category_service_id"
              label="Dịch vụ nha khoa"
              rules={[
                {
                  required: true,
                  message: 'Bạn chưa chọn khu vực',
                },
              ]}
            >
              <Select
                className='select-form-contact'
                style={{ width: '100%' }}
                showSearch
                filterOption={filterOption}
                placeholder="Chọn dịch vụ nha khoa"
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
            </FormItem>
          </Col>
          <Col xs={12}>
            <FormItem
              style={{ marginBottom: 16, marginRight: 8 }}
              name="contact_clinic"
              label="Phòng khám"
              initialValue={[]}
              rules={[
                {
                  required: true,
                  message: 'Bạn chưa chọn phòng khám',
                },
              ]}
            >
              <Select
                mode="multiple"
                className='select-form-contact'
                style={{ width: '100%' }}
                showSearch
                filterOption={filterOption}
                placeholder="Chọn phòng khám phù hợp                        "
              >
                {dataCreate &&
                  dataCreate.listClinic &&
                  dataCreate.listClinic.data.map((clinic) => {
                    return (
                      <Option key={clinic.id} value={clinic.id}>
                        {clinic.name}
                      </Option>
                    );
                  })}
              </Select>
            </FormItem>
          </Col>
          <Col xs={12}>
            <FormItem
              name="note"
              label="Lời nhắn"
            >
              <textarea className='textarea-contact' placeholder='Lời nhắn của bạn ...'/>
            </FormItem>
          </Col>
        </Row>
        <FormItem className="wrapper-button-submit">
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            className="submit-btn-edit-contact"
            // onClick={onSubmit}
          >
            <div>Sửa thông tin liên hệ</div>
          </Button>
        </FormItem>
      </div>
    );
  };

  const onFinish = async () => {
    const fieldsValue = await form.validateFields();
    const result = await editContact({ ...fieldsValue }, props.id);
    if (result.status === 200) {
      props.onDone();
    }
  }

  return (
    <div>
      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={() => {
          message.error('Kiểm tra lại Thông tin liên hệ!');
        }}
        layout={'vertical'}
      >
        {loadingPage ? <Skeleton /> : renderEditForm()}
      </Form>
    </div>
  );
};
export default EditContactForm;
