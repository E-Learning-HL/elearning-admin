import { useEffect, useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import {
  LoadingOutlined,
  PlusSquareOutlined,
  UploadOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Skeleton,
  message,
  Cascader,
  Divider,
  Upload,
  Card,
  Popconfirm,
  Checkbox,
} from 'antd';
import { history } from 'umi';
import { strVNForSearch } from '../../../common/util';
import { createDoctor, editAssigment, getAssign, getListCourse, createAssigment } from '../service';
import './index.less';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

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

const CreateDoctorForm = (props) => {
  const editor = useRef();
  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };
  const [form] = Form.useForm();
  const [loadingPage, setLoadingPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataCreate, setDataCreate] = useState(null);
  const [typeAssign, setTypeAssign] = useState(null);
  const [renderTypeExam, setRenderTypeExam] = useState([]);
  const [dataListCourse, setDataListCourse] = useState(null);
  const [courseOptions, setCourseOptions] = useState(null);
  const [typeListeningQuestion, setTypeListeningQuestion] = useState([]);
  const [typeReadingQuestion, setTypeReadingQuestion] = useState([]);
  const [taskListeningId, setTaskListeningId] = useState(null);
  const [taskReadingId, setTaskReadingId] = useState(null);
  // const [triggerContent, setTriggerContent] = useState(null);
  // const [key, setKey] = useState(0);

  // useEffect(() => {
  //   if (props.id === 'EDIT') setTriggerContent(form.getFieldValue('reading_content'));
  //   setKey((prevKey) => prevKey + 1);
  // }, [form.getFieldValue('reading_content')]);

  useEffect(() => {
    async function fetchDataListCourse() {
      const data = await getListCourse();
      setDataListCourse(data.data);
    }

    fetchDataListCourse();
  }, []);

  useEffect(() => {
    if (dataListCourse) {
      const mappedCourses = dataListCourse?.map((item) => ({
        value: item.id,
        label: item.nameCourse,
        children:
          typeAssign === 'TESTS'
            ? []
            : (item.section || []).map((itemSection) => ({
                value: itemSection.id,
                label: itemSection.nameSection,
              })),
      }));
      setCourseOptions(mappedCourses);
    }
  }, [dataListCourse, typeAssign]);

  // Example data for course
  // const courseOptions = [
  //   {
  //     value: 'ielts 4.5',
  //     label: 'ielts 4.5',
  //     children: [
  //       {
  //         value: 'section 1',
  //         label: 'section 1',
  //       },
  //     ],
  //   },
  //   {
  //     value: 'ielts 6.5',
  //     label: 'ielts 6.5',
  //     children: [
  //       {
  //         value: 'section 1',
  //         label: 'section 1',
  //       },
  //     ],
  //   },
  //   {
  //     value: 'ielts 5.5',
  //     label: 'ielts 5.5',
  //     children: [
  //       {
  //         value: 'section 1',
  //         label: 'section 1',
  //       },
  //     ],
  //   },
  // ];

  const fillterOption = (input, option) => {
    if (option.props.value) {
      return strVNForSearch(option.props.children).includes(strVNForSearch(input));
    } else {
      return false;
    }
  };
  const onFinish = async (values) => {
    setLoading(true);
    const fieldsValue = await form.validateFields();
    // const newImage = [{ link: fieldsValue.avatar, image_type: 'AVATAR' }];

    const body = {
      name: fieldsValue.name,
      status: fieldsValue.status,
      examType: fieldsValue.type_assign,
      courseId: fieldsValue.course_location[0],
      sectionId: fieldsValue.course_location[1] || null,
      task: [],
    };
    

    if (fieldsValue.audio && fieldsValue.listening_question) {
      if(props.type === "EDIT"){
        body.task.push({
          audio: fieldsValue.audio,
          taskType: 'LISTENING',
          question: fieldsValue.listening_question,
          taskId: taskListeningId
        });
      }else{
        body.task.push({
          audio: fieldsValue.audio,
          taskType: 'LISTENING',
          question: fieldsValue.listening_question,
        });
      }
    }

    if (fieldsValue.reading_content && fieldsValue.reading_question) {
      if(props.type === "EDIT"){
        body.task.push({
          content: fieldsValue.reading_content,
          taskType: 'READING',
          question: fieldsValue.reading_question,
          taskId: taskReadingId
        });
      }else{
      body.task.push({
        content: fieldsValue.reading_content,
        taskType: 'READING',
        question: fieldsValue.reading_question,
      });
    }
    }

    // console.log('fieldsValue', fieldsValue);
    console.log('bodydyyyy', body);

    if (props.type === 'EDIT') {
      const result = await editAssigment({ ...body }, props.id);
      if (result.status === 200) {
        props.onDone();
      }
      console.log("body", body)
    } else {
    const result = await createAssigment(body);
    if (result.status === 200) {
      form.resetFields();
      history.push('/doctor');
      props.onDone();
    }
    //   if (props.type === 'CREATE-CLINIC') {
    //     props.onDone(result.data.id);
    //   }
    }

    setLoading(false);
  };
  useEffect(() => {
    setRenderTypeExam(form.getFieldValue('type-exam'));
    console.log('type-exam', form.getFieldValue('type-exam'));
  }, [form.getFieldValue('type-exam')]);

  useEffect(() => {
    async function fetchData() {
      if (props.id) {
        setLoadingPage(true);
        const dataEdit = await getAssign(props.id);
        const dataForm = { ...dataEdit.data };

        const typeTasks = dataForm.task.map((item) => item.taskType);
        const taskListening = dataForm.task.find((item) => item.taskType === 'LISTENING');
        const taskReading = dataForm.task.find((item) => item.taskType === 'READING');

        setTaskListeningId(taskListening?.id)
        setTaskReadingId(taskReading?.id)

        form.setFieldsValue({
          name: dataForm.nameAssignment,
          status: dataForm.isActive,
          type_assign: dataForm.assignmentType,
          course_location: dataForm.section
            ? [dataForm.course.id, dataForm.section.id]
            : [dataForm.course.id],
          'type-exam': typeTasks,
          audio: [
            {
              fileId: taskListening?.file[0]?.id,
              name: 'Âm thanh',
              url: taskListening?.file[0]?.url,
            },
          ],
          listening_question: taskListening?.question?.map((item) => {
            return {
              questionId: item.id,
              questionType: item.questionType,
              title: item.title,
              answer: item.answer.map((itemAws) => {
                return {
                  title: itemAws.content,
                  answerId: itemAws.id,
                  isCorrect: itemAws.isCorrect,
                };
              }),
            };
          }),
          reading_content: taskReading?.content,
          reading_question: taskReading?.question?.map((item) => {
            return {
              questionId: item.id,
              questionType: item.questionType,
              title: item.title,
              answer: item.answer.map((itemAws) => {
                return {
                  title: itemAws.content,
                  answerId: itemAws.id,
                  isCorrect: itemAws.isCorrect,
                };
              }),
            };
          }),
        });

        // const body = {
        //   name: fieldsValue.name,
        //   status: fieldsValue.status,
        //   exam_type: fieldsValue.type_assign,
        //   course_id: fieldsValue.course_location[0],
        //   section_id: fieldsValue.course_location[1] || null,
        //   task: [],
        // };

        // const dataService = newDataEdit.doctor_service.map((item) => {
        //   return item.category_service?.id;
        // });

        // const dataImage = newDataEdit.image.map((item) => {
        //   return {
        //     link: item.link,
        //     image_type: item.image_type,
        //   };
        // });

        setLoadingPage(false);
      }
    }
    fetchData();
  }, [props.id]);
  const renderCreateForm = () => {
    return (
      <div>
        <Row gutter={[10, 0]}>
          {/* Name */}
          <Col xs={16}>
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
          {/* Status */}
          <Col xl={8}>
            <FormItem
              label="Trạng thái"
              name="status"
              rules={[
                {
                  required: true,
                  message: 'Bạn chưa chọn trạng thái',
                },
              ]}
            >
              <Select
                placeholder="Chọn trạng thái"
                options={[
                  {
                    value: false,
                    label: 'Imported',
                  },
                  {
                    value: true,
                    label: 'Public',
                  },
                ]}
              />
            </FormItem>
          </Col>
          {/* title */}
          <Col xl={8}>
            <FormItem
              label="Loại Assignments"
              name="type_assign"
              rules={[
                {
                  required: true,
                  message: 'Bạn chưa chọn loại Assignments',
                },
              ]}
            >
              <Select
                placeholder="Chọn loại Assignments"
                disabled={props.type==="EDIT" ? true : false}
                onChange={(e) => {
                  setTypeAssign(e);
                  if (e == 'TESTS') form.setFieldValue('type-exam', ['LISTENING', 'READING']);
                  else form.setFieldValue('type-exam', []);
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
          <Col xl={8}>
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
                disabled={typeAssign === 'TESTS' || props.type==="EDIT" ? true : false}
                onChange={(e) => {
                  setRenderTypeExam(e);
                }}
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
          <Col xl={8}>
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
                disabled={typeAssign == null || props.type==="EDIT" ? true : false}
              />
            </FormItem>
          </Col>
          {renderTypeExam?.includes('LISTENING') && (
            <>
              <Divider />
              {/* Tạo bài nghe */}
              <div className="task-title">Listening</div>
              {/* Upload audio */}
              <Col xl={12}>
                <FormItem
                  label="Audio"
                  name="audio"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  rules={[
                    {
                      required: true,
                      message: 'Bạn chưa tải lên audio',
                    },
                  ]}
                >
                  <Upload
                    listType="picture"
                    accept="audio/*"
                    maxCount={1}
                    // beforeUpload={beforeUpload}
                    // onChange={() => {
                    //   form.setFieldsValue({ coverId: undefined });
                    // }}
                    // onPreview={onPreview}
                    customRequest={async ({ onSuccess, file, onError }) => {
                      const isMp3OrAac = file.type === 'audio/mpeg' || file.type === 'audio/aac';
                      if (!isMp3OrAac) {
                        message.error('You can only upload Mp3/Aac file!');
                        onError();
                      }
                      const isLt10M = file.size / 1024 / 1024 < 10;
                      if (!isLt10M) {
                        message.error('Video must smaller than 10MB!');
                        onError();
                      }
                      if (isMp3OrAac && isLt10M) {
                        // console.log(file)
                        const base64 = await getNewBase64(file);
                        onSuccess(base64);
                      }
                    }}
                  >
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                </FormItem>
              </Col>
              {/* Content */}
              {/* <Col xl={24}>
                <FormItem
                  label="Nội dung"
                  name="listening_content"
                  rules={[
                    {
                      required: true,
                      message: 'Bạn chưa chọn khóa học',
                    },
                  ]}
                >
                  <SunEditor
                    getSunEditorInstance={getSunEditorInstance}
                    setOptions={{
                      height: 250,
                      buttonList: [
                        ['undo', 'redo'],
                        ['font', 'fontSize', 'formatBlock'],
                        ['table', 'link', 'image', 'video'], // Thêm nút bảng vào thanh công cụ
                        ['bold', 'underline', 'italic', 'strike'],
                        ['fontColor', 'hiliteColor'],
                        ['align', 'list'],
                      ],
                    }}
                  />
                </FormItem>
              </Col> */}
              <Col span={24} style={{ marginBottom: 15 }} className="question-card">
                <Form.List name="listening_question" initialValue={[{}]}>
                  {(fields, { add, remove }) => (
                    <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}>
                      {fields.map((field, index) => {
                        return (
                          <Card
                            size="small"
                            title={
                              <div className="header-card">
                                <span>Câu hỏi {field.name + 1}</span>
                                <FormItem
                                  name={[field.name, 'questionType']}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Bạn chưa chọn loại câu hỏi',
                                    },
                                  ]}
                                  style={{ maxWidth: 150 }}
                                >
                                  <Select
                                    // defaultValue={'SIMPLE_CHOICE'}
                                    disabled={props.type==="EDIT"}
                                    placeholder="Chọn loại câu hỏi"
                                    onChange={(e) => {
                                      // setTypeAssign(e);
                                      // if (e == 'TESTS')
                                      //   form.setFieldValue('type-exam', ['LISTENING', 'READING']);
                                      // else form.setFieldValue('type-exam', []);
                                      const newTypeListeningQuestion = [...typeListeningQuestion];
                                      if (newTypeListeningQuestion[index]) {
                                        newTypeListeningQuestion[index] = e;
                                      } else {
                                        newTypeListeningQuestion.push(e);
                                      }
                                      setTypeListeningQuestion(newTypeListeningQuestion);
                                    }}
                                    options={[
                                      {
                                        value: 'INPUT',
                                        label: 'Input',
                                      },
                                      {
                                        value: 'SIMPLE_CHOICE',
                                        label: 'Simple Choice',
                                      },
                                      {
                                        value: 'MULTIPLE_CHOICE',
                                        label: 'Multiple Choice',
                                      },
                                    ]}
                                  />
                                </FormItem>
                                <Form.Item
                                  // label="Tên dịch vụ"
                                  name={[field.name, 'title']}
                                  rules={[
                                    {
                                      required: false,
                                      message: 'Bạn chưa nhập question',
                                    },
                                  ]}
                                >
                                  {typeListeningQuestion[index] === 'INPUT' ? (
                                    <SunEditor
                                      placeholder="Nhập câu hỏi"
                                      getSunEditorInstance={getSunEditorInstance}
                                      setOptions={{
                                        height: 250,
                                        buttonList: [
                                          ['formatBlock'],
                                          ['table', 'link', 'image', 'video'], // Thêm nút bảng vào thanh công cụ
                                          ['bold', 'underline', 'italic', 'strike'],
                                          ['fontColor', 'hiliteColor'],
                                          ['align', 'list'],
                                        ],
                                      }}
                                    />
                                  ) : (
                                    <Input placeholder="Nhập câu hỏi"></Input>
                                  )}
                                </Form.Item>
                              </div>
                            }
                            key={field.key}
                            extra={
                              <Popconfirm
                                title="Bạn có chắc chắn xóa không?"
                                placement="topRight"
                                onConfirm={() => {
                                  remove(field.name);
                                }}
                                okText="Ok"
                                cancelText="Hủy"
                              >
                                <CloseOutlined />
                              </Popconfirm>
                            }
                          >
                            <Form.Item>
                              <Form.List name={[field.name, 'answer']} initialValue={[{}, {}, {}]}>
                                {(subFields, subOpt) => (
                                  <div
                                    style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}
                                  >
                                    {subFields.map((subField, awsIndex) => (
                                      <Row key={subField.key} className="row-answer">
                                        <Col span={12} className="padding-right">
                                          <Form.Item
                                            // label={`Câu hỏi ${awsIndex+1}`}
                                            name={[subField.name, 'title']}
                                            rules={[
                                              {
                                                required: true,
                                                message: 'Bạn chưa điền đáp án',
                                              },
                                            ]}
                                          >
                                            <Input placeholder={`Đáp án ${awsIndex + 1}`} />
                                          </Form.Item>
                                        </Col>
                                        <Col className="check-box">
                                          {/* <FormItem
                                              name={[subField.name, 'is_correct']}
                                              // valuePropName="checked"
                                              initialValue={typeListeningQuestion[index] === 'INPUT'}
                                            >
                                              {
                                                (typeListeningQuestion[index] === 'SIMPLE_CHOICE' ||
                                                typeListeningQuestion[index] === 'MULTIPLE_CHOICE') &&
                                                <Checkbox disabled={typeListeningQuestion[index] === 'INPUT'}></Checkbox>
                                              }
                                              
                                            </FormItem> */}

                                          {/* {(typeListeningQuestion[index] === 'SIMPLE_CHOICE' ||
                                            typeListeningQuestion[index] === 'MULTIPLE_CHOICE') && (
                                            <FormItem
                                              name={[subField.name, 'is_correct']}
                                              valuePropName="checked"
                                              initialValue={false}
                                            >
                                              <Checkbox></Checkbox>
                                            </FormItem>
                                          )} */}
                                          <FormItem
                                            name={[subField.name, 'isCorrect']}
                                            valuePropName="checked"
                                            initialValue={false}
                                          >
                                            <Checkbox></Checkbox>
                                          </FormItem>
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
                                      + Thêm answer
                                    </Button>
                                  </div>
                                )}
                              </Form.List>
                            </Form.Item>
                          </Card>
                        );
                      })}

                      <Button type="dashed" onClick={() => add()} block>
                        + Thêm question
                      </Button>
                    </div>
                  )}
                </Form.List>
              </Col>
            </>
          )}

          {renderTypeExam?.includes('READING') && (
            <>
              <Divider />
              {/* Tạo bài đọc */}
              <div className="task-title">Reading</div>
              {/* Content */}
              <Col xl={24}>
                <FormItem
                  label="Nội dung"
                  name="reading_content"
                  rules={[
                    {
                      required: true,
                      message: 'Bạn chưa điền nội dung',
                    },
                  ]}
                >
                  {/* <Input></Input> */}
                  {props.type === 'EDIT' ? (
                    <ReactQuill
                      theme="snow"
                      modules={{
                        toolbar: [
                          [{ header: [1, 2, false] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [
                            { list: 'ordered' },
                            { list: 'bullet' },
                            { indent: '-1' },
                            { indent: '+1' },
                          ],
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
                  ) : (
                    <SunEditor
                      getSunEditorInstance={getSunEditorInstance}
                      setOptions={{
                        height: 250,
                        buttonList: [
                          ['formatBlock'],
                          ['table', 'link', 'image', 'video'], // Thêm nút bảng vào thanh công cụ
                          ['bold', 'underline', 'italic', 'strike'],
                          ['fontColor', 'hiliteColor'],
                          ['align', 'list'],
                        ],
                      }}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={24} style={{ marginBottom: 15 }} className="question-card">
                <Form.List name="reading_question" initialValue={[{}]}>
                  {(fields, { add, remove }) => (
                    <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}>
                      {fields.map((field, index) => {
                        return (
                          <Card
                            size="small"
                            title={
                              <div className="header-card">
                                <span>Question {field.name + 1}</span>
                                <FormItem
                                  name={[field.name, 'questionType']}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Bạn chưa chọn loại câu hỏi',
                                    },
                                  ]}
                                  style={{ maxWidth: 150 }}
                                >
                                  <Select
                                    // defaultValue={'SIMPLE_CHOICE'}
                                    disabled={props.type==="EDIT"}
                                    placeholder="Chọn loại câu hỏi"
                                    onChange={(e) => {
                                      // setTypeAssign(e);
                                      // if (e == 'TESTS')
                                      //   form.setFieldValue('type-exam', ['LISTENING', 'READING']);
                                      // else form.setFieldValue('type-exam', []);
                                      const newTypeReadingQuestion = [...typeReadingQuestion];
                                      if (newTypeReadingQuestion[index]) {
                                        newTypeReadingQuestion[index] = e;
                                      } else {
                                        newTypeReadingQuestion.push(e);
                                      }
                                      setTypeReadingQuestion(newTypeReadingQuestion);
                                    }}
                                    options={[
                                      {
                                        value: 'INPUT',
                                        label: 'Input',
                                      },
                                      {
                                        value: 'SIMPLE_CHOICE',
                                        label: 'Simple Choice',
                                      },
                                      {
                                        value: 'MULTIPLE_CHOICE',
                                        label: 'Multiple Choice',
                                      },
                                    ]}
                                  />
                                </FormItem>
                                <Form.Item
                                  // label="Tên dịch vụ"
                                  name={[field.name, 'title']}
                                  rules={[
                                    {
                                      required: false,
                                      message: 'Bạn chưa nhập question',
                                    },
                                  ]}
                                >
                                  {typeReadingQuestion[index] === 'INPUT' ? (
                                    <SunEditor
                                      placeholder="Nhập câu hỏi"
                                      getSunEditorInstance={getSunEditorInstance}
                                      setOptions={{
                                        height: 250,
                                        buttonList: [
                                          ['formatBlock'],
                                          ['table', 'link', 'image', 'video'], // Thêm nút bảng vào thanh công cụ
                                          ['bold', 'underline', 'italic', 'strike'],
                                          ['fontColor', 'hiliteColor'],
                                          ['align', 'list'],
                                        ],
                                      }}
                                    />
                                  ) : (
                                    <Input placeholder="Nhập câu hỏi"></Input>
                                  )}
                                </Form.Item>
                              </div>
                            }
                            key={field.key}
                            extra={
                              <Popconfirm
                                title="Bạn có chắc chắn xóa không?"
                                placement="topRight"
                                onConfirm={() => {
                                  remove(field.name);
                                }}
                                okText="Ok"
                                cancelText="Hủy"
                              >
                                <CloseOutlined />
                              </Popconfirm>
                            }
                          >
                            <Form.Item>
                              <Form.List name={[field.name, 'answer']} initialValue={[{}, {}, {}]}>
                                {(subFields, subOpt) => (
                                  <div
                                    style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}
                                  >
                                    {subFields.map((subField, awsIndex) => (
                                      <Row key={subField.key} className="row-answer">
                                        <Col span={12} className="padding-right">
                                          <Form.Item
                                            name={[subField.name, 'title']}
                                            rules={[
                                              {
                                                required: true,
                                                message: 'Bạn chưa điền đáp án',
                                              },
                                            ]}
                                          >
                                            <Input placeholder={`Đáp án ${awsIndex + 1}`} />
                                          </Form.Item>
                                        </Col>
                                        <Col className="check-box">
                                          <FormItem
                                            name={[subField.name, 'isCorrect']}
                                            valuePropName="checked"
                                            initialValue={false}
                                          >
                                            <Checkbox></Checkbox>
                                          </FormItem>
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
                                      + Thêm answer
                                    </Button>
                                  </div>
                                )}
                              </Form.List>
                            </Form.Item>
                          </Card>
                        );
                      })}

                      <Button type="dashed" onClick={() => add()} block>
                        + Thêm question
                      </Button>
                    </div>
                  )}
                </Form.List>
              </Col>
            </>
          )}
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
