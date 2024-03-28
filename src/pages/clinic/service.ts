import { getAuthority, getInfo } from '@/common/authority';
import { remove } from '@/common/request';
import { DEV_API_HOST } from '@/const/const';
import { request } from '@umijs/max';
import { message } from 'antd';


export async function createCourse(body: any) {
  try {

    let res = await request(`${DEV_API_HOST}/api/courses/create-courses`, {
      method: 'POST',
      // headers: {
      //   'Content-Type': 'application/json',
      //   Authorization: `Bearer ${getAuthority()}`,
      // },
      data: { ...body },
    });
    if (res?.status === 200) {
      message.success('Thành công');
    }
    return res;
  } catch (error) {
    return false;
  }
}

export async function getListCourse(
  params: {
    current?: number;
    pageSize?: number;
    name?: string;
  },
  options?: { [key: string]: any },
) {
  let newParams = {
    page: params.current,
    limit: params.pageSize,
    search: params.name,
  };
  const result = await request(`${DEV_API_HOST}/api/courses/get-list`, {
    method: 'GET',
    params: {
      ...newParams,
    },
    ...(options || {}),
  });
  return {
    data: result.data,
    success: true,
    total: result.total,
  };
}




export async function getListClinic(
  params: {
    current?: number;
    pageSize?: number;
    name?: string;
  },
  options?: { [key: string]: any },
) {
  let newParams = {
    page: params.current,
    limit: params.pageSize,
    name: params.name,
  };
  const result = await request(`${DEV_API_HOST}/admin/clinic`, {
    method: 'GET',
    params: {
      ...newParams,
    },
    ...(options || {}),
  });
  return {
    data: result.data,
    success: true,
    total: result.total,
  };
}
export async function removeClinic(id: number) {
  return remove(`admin/clinic/${id}`);
}
export async function getClinic(id: number) {
  const result = await request(`${DEV_API_HOST}/admin/clinic/${id}`, {
    method: 'GET',
  });
  return {
    data: result,
  };
}
export async function getListProvince() {
  const result = await request(`${DEV_API_HOST}/admin/province`, {
    method: 'GET',
  });
  return {
    data: result,
  };
}
export async function getListDistrict(id: number) {
  const result = await request(`${DEV_API_HOST}/admin/district/get-by-province-id/${id}`, {
    method: 'GET',
  });
  return {
    data: result,
  };
}
export async function getListSpecialization() {
  const result = await request(`${DEV_API_HOST}/admin/specialization`, {
    method: 'GET',
  });
  return {
    data: result,
  };
}
export async function createClinic(body: any) {
  try {
    const user_id = parseInt(getInfo() as string);

    let res = await request(`${DEV_API_HOST}/admin/clinic`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthority()}`,
      },
      data: { ...body, user_id },
    });
    if (res?.status === 200) {
      message.success('Thành công');
    }
    return res;
  } catch (error) {
    return false;
  }
}
export async function updateClinic(body: any, id: number) {
  try {
    const user_id = parseInt(getInfo() as string);

    let res = await request(`${DEV_API_HOST}/admin/clinic/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthority()}`,
      },
      data: { ...body, user_id },
    });
    if (res?.status === 200) {
      message.success('Chỉnh sửa thành công');
    }
    return res;
  } catch (error) {
    return false;
  }
}
export async function getListService() {
  const result = await request(`${DEV_API_HOST}/admin/category-service`, {
    method: 'GET',
  });
  return {
    data: result.data,
  };
}
export async function getListTag() {
  const result = await request(`${DEV_API_HOST}/admin/tag`, {
    method: 'GET',
  });
  return {
    data: result.data,
  };
}
export async function getListDoctor(id: number) {
  const result = await request(
    `${DEV_API_HOST}/admin/doctor/not-connect-clinic${
      id !== undefined ? `-without-one/${id}` : ''
    }`,
    {
      method: 'GET',
    },
  );
  return {
    data: result,
  };
}

export async function getListImage(clinic_id: number) {
  if (clinic_id !== undefined) {
    const result = await request(`${DEV_API_HOST}/admin/image/${clinic_id}`, {
      method: 'GET',
    });

    return {
      data: result,
    };
  } else {
    return {
      data: [],
    };
  }
}

// export async function getListServiceOfClinic(clinic_id: number) {
//   const result = await request(`${DEV_API_HOST}/service-clinic/${clinic_id}`, {
//     method: 'GET',
//   });
//   return {
//     data: result,
//   };
// }
