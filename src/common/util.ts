export const strVNForSearch = (str: any) => {
  return str
    ? str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
    : str;
};
export const formatWorkingDays = (workingDays: any) => {
  const sortedDays = workingDays;
  let result = '';
  let startRange = sortedDays[0].id;

  for (let i = 1; i < sortedDays.length; i++) {
    if (sortedDays[i].id !== sortedDays[i - 1].id + 1) {
      if (result !== '') {
        result += ', ';
      }
      if (startRange === sortedDays[i - 1].id) {
        result += startRange === 8 ? 'Chủ nhật' : `Thứ ${startRange}`;
      } else {
        result += `Thứ ${startRange} -`;
        if (sortedDays[i - 1].id === 8) {
          result += ' Chủ nhật';
        } else {
          result += ` Thứ ${sortedDays[i - 1].id}`;
        }
      }
      startRange = sortedDays[i].id;
    }
  }

  if (result !== '') {
    result += ', ';
  }
  if (startRange === sortedDays[sortedDays.length - 1].id) {
    result += startRange === 8 ? 'Chủ nhật' : `Thứ ${startRange}`;
  } else {
    result += `Thứ ${startRange} - `;
    if (sortedDays[sortedDays.length - 1].id === 8) {
      result += ' Chủ nhật';
    } else {
      result += `  Thứ ${sortedDays[sortedDays.length - 1].id}`;
    }
  }

  return result;
};

export const toSlug = (input: string) => {
  return input
    .toLowerCase()
    .replace(/\s+/g, '-') // Thay thế khoảng trắng bằng dấu gạch ngang
    .normalize('NFD') // Chuyển chuỗi về dạng Unicode Normalization Form D
    .replace(/[\u0300-\u036f]/g, '') // Loại bỏ các ký tự dấu thanh và dấu mũ
    .replace(/[^a-z0-9-]/g, ''); // Loại bỏ các ký tự không phải là chữ cái, số, hoặc dấu gạch ngang
};
