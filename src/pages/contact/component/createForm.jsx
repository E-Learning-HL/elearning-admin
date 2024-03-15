import { Button, Form, Input, Select, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import { strVNForSearch } from '@/common/util';
import { getListDistrict, getListProvince, getListService, getListClinic, createContact } from '../service';
import './index.less';

const { Option } = Select;
const FormItem = Form.Item;
const CreateContactForm = (props) => {
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

  const renderCreateForm = () => {
    return (
      <div>
        <div className='form-contact'>
          <div className='form-contact-title'>ĐĂNG KÝ NHẬN TƯ VẤN TỪ CHUYÊN GIA</div>
          <FormItem
            style={{ marginBottom: 8, marginTop: 40 }}
            name="customer_name"
            rules={[
                {
                required: true,
                message: 'Bạn chưa nhập tên',
                },
            ]}
            >
            <Input className="input-form-contact" placeholder="Họ và tên" />
          </FormItem>
          <FormItem
            style={{ marginBottom: 8 }}
            name="customer_phone_number"
            rules={[
                {
                required: true,
                message: 'Bạn chưa nhập số điện thoại',
                },
            ]}
            >
            <Input className="input-form-contact" placeholder="Số điện thoại" />
          </FormItem>
          <FormItem
            style={{ marginBottom: 8 }}
            name="email"            >
            <Input className="input-form-contact" placeholder="Email" />
          </FormItem>
          <FormItem
            style={{ marginBottom: 8 }}
            name="province_id"
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
          <Form.Item
            style={{ marginBottom: 8 }}
            name= "district_id"
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
          <FormItem
            style={{ marginBottom: 8 }}
            name="category_service_id"
            rules={[
                {
                required: true,
                message: 'Bạn chưa chọn dịch vụ',
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
          <FormItem
            style={{ marginBottom: 8 }}
            name="contact_clinic"
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
          <FormItem
              name="note"
              style={{ marginBottom: 0 }}
              >
              <textarea className='textarea-form-contact' placeholder='Lời nhắn của bạn ...'/>
          </FormItem>
          <FormItem className="wrapper-button-submit">
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              className="submit-btn-form-contact"
              // onClick={onSubmit}
            >
              <div>Đăng ký ngay</div>
            </Button>
          </FormItem>
        </div>
      </div>
    );
  };

  const onFinish = async () => {
    const fieldsValue = await form.validateFields();
    const result = await createContact({ ...fieldsValue });
    if (result.status === 200) {
      form.resetFields();
      return(
        <div></div>
      )
    }
  }

  return (
    <div>
      <Form
        form={form}
        onFinish={onFinish}
      >
        {loadingPage ? <Skeleton /> : renderCreateForm()}
      </Form>
    </div>
  );
};
export default CreateContactForm;