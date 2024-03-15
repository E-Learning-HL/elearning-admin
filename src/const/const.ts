export const DEV_API_HOST =
  REACT_APP_ENV === 'dev' ? 'http://localhost:3002' : 'http://localhost:3002';
export const FORM_TYPE = { EDIT: 'EDIT' };
export const DEFAULT_LIST_WEEKDAY = [
  { work: false },
  { work: false },
  { work: false },
  { work: false },
  { work: false },
  { work: false },
  { work: false },
];

export const COPILOT_QUESION = {
  services: (website: string) => {
    return `Bạn là một phần mềm trả về dữ liệu hiển thị format json.
      Đây là website ${website}
      lấy ra các loại dịch vụ trong website trùng với danh sách loại dịch vụ dưới đây:
      - Trồng răng Implant
      - Răng sứ
      - Răng sứ thẩm mỹ
      - Niềng răng
      - Niềng răng thẩm mỹ
      - Nhổ răng
      - Tổng quát
      - Nha khoa tổng quát
      - Tảy trắng răng
      - Dịch vụ khác

      Liệt kê danh sách dịch vụ và giá tương ứng dưới dạng json, bao gồm các thông tin sau:
      - Tên loại dịch vụ
      - Tên dịch vụ
      - Giá dịch vụ
      - Đơn vị tính
      - Thời gian bảo hành
      Format json như sau : [
        {
          "name": <Tên chuyên khoa>,
          "service": [{
            "name": <tên dịch vụ>,
            "amount": <giá dịch vụ>,
            "unit": <đơn vị tính>,
            "guarantee": <thời gian bảo hành>
          }]
        }
    ]"`;
  },
  specialization: (website: string) => {
    return `Bạn là một phần mềm trả về dữ liệu hiển thị format json.
    Đây là website ${website}
    lấy ra các chuyên khoa trong website trùng với danh sách chuyên khoa dưới đây:
    - Chỉnh nha
    - Chăm sóc nha khoa
    - Phục hình răng
    - Nội nha
    - X-Quang chỉnh hình miệng
    - Phẫu thuật tháo lắp răng
    - Nha khoa nhi
    - Nha khoa y tế cộng đồng
    - Chấn thương chỉnh hình hàm mặt
    - Nha khoa tổng quát
    - Nha khoa Thẩm mỹ

    Liệt kê dưới dạng json,thông tin trả về bao gồm các thông tin sau:
    - Tên chuyên khoa
    Format json như sau : [{"name": <Tên chuyên khoa>}]
  `;
  },
  address: (website: string) => {
    return `Bạn là một phần mềm trả về dữ liệu hiển thị format json.
    Đây là website ${website}
    Liệt kê danh sách cơ sở dưới dạng json, bao gồm các thông tin sau:
    - Địa chỉ
    - Phường / Xã
    - Tỉnh / Thành Phố
    Format json như sau : [{"province": <Tỉnh / Thành Phố>, "district": <Phường / Xã>, "detail_address": <Địa chỉ> }]`;
  },
  phone: (website: string) => {
    return `Bạn là một phần mềm trả về dữ liệu hiển thị format json.
    Đây là website ${website}
    Liệt kê số hotline, số điện thoại liên lạc của nha khoa:
    Format json như sau : [{"phone_number": <Số điện thoại>}]`;
  },
  // doctor: (website: string) => {
  //   return `Bạn là một phần mềm trả về dữ liệu hiển thị format json.
  //   Đây là website website
  //   Liệt kê Danh sách đội ngũ bác sĩ có trong nha khoa dưới dạng json, bao gồm các thông tin sau:
  //   - Tên
  //   - Chuyên khoa. (Bỏ trống nếu không nằm trong danh sách chuyên khoa phía dưới.)
  //   - Giới thiệu. (ngắn ngọn trong 200 kí tự)
  //   - kinh nghiệm (lấy số năm)
  //   - copy image address: (lấy link ảnh)
  //   Format json như sau : [{name: <tên>, introduce: <Giới thiệu>, avatar: <image address>, title: <Chuyên khoa>, experience_time: <kinh nghiệm> ]`
  // },
  workday: (website: string) => {
    return `Bạn là một phần mềm trả về dữ liệu hiển thị format json.
      Đây là website ${website}
      Liệt kê thời gian làm việc trong tuần dưới dạng json, bao gồm các thông tin sau:
      - Thứ trong tuần (liệt kê các ngày làm việc, dạng mảng)
      - Thời gian làm việc ( Nếu đóng cửa hãy để trống.)
      Format json như sau : [{"working_day": [<Thứ trong tuần>], "work_time": <Thời gian làm việc>]`;
  },
};

export const PREFIX_IMAGE_URL = 'http://localhost:8000/local-bucket/';

export const IMAGE_TYPE = {
  avatar: 'AVATAR',
  banner: 'BANNER',
  introduce: 'INTRODUCE',
};
