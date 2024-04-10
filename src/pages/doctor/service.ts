import { getAuthority } from '@/common/authority';
import { remove } from '@/common/request';
import { DEV_API_HOST } from '@/const/const';
import { request } from '@umijs/max';
import { message } from 'antd';

export async function getListAssign(
  params: {
    current?: number;
    pageSize?: number;
    nameAssignment?: string;
  },
  options?: { [key: string]: any },
) {
  console.log('params', params);
  let newParams = {
    page: params.current,
    limit: params.pageSize,
    search: params.nameAssignment,
  };
  const result = await request(`${DEV_API_HOST}/api/assignments/get-list-assignments`, {
    method: 'GET',
    params: {
      ...newParams,
    },
    ...(options || {}),
  });
  console.log('result', result);
  return {
    data: result.data,
    success: true,
    total: result.total,
  };
}

export async function getAssign(id: number) {
  const result = await request(`${DEV_API_HOST}/api/assignments/${id}`, {
    method: 'GET',
  });
  return {
    data: result,
  };
}

export async function getListCourse() {
  const result = await request(`${DEV_API_HOST}/api/courses/get-list`, {
    method: 'GET',
    params: {
      limit: 100
    },
  });
  return {
    data: result.data,
  };
}

export async function createAssigment(body: any){
  try {
    let res = await request(`${DEV_API_HOST}/api/assignments/create-assignment`, {
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

export async function editAssigment(body: any, id: number) {
  try {
    let res = await request(`${DEV_API_HOST}/api/assignments/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthority()}`,
      },
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

export async function getListDoctor(
  params: {
    current?: number;
    pageSize?: number;
    name?: string;
  },
  options?: { [key: string]: any },
) {
  console.log('params', params);
  let newParams = {
    page: params.current,
    limit: params.pageSize,
    name: params.name,
  };
  const result = await request(`${DEV_API_HOST}/admin/doctor`, {
    method: 'GET',
    params: {
      ...newParams,
    },
    ...(options || {}),
  });
  console.log('result', result);
  return {
    data: result.data,
    success: true,
    total: result.total,
  };
}

export async function removeDoctor(id: number) {
  return remove(`admin/doctor/${id}`);
}
export async function getDoctor(id: number) {
  const result = await request(`${DEV_API_HOST}/admin/doctor/${id}`, {
    method: 'GET',
  });
  return {
    data: result,
  };
}
export async function getListDoctorClinic(clinic_id: number) {
  const result = await request(`${DEV_API_HOST}/admin/doctor/${clinic_id}`, {
    method: 'GET',
  });
  return {
    data: result,
  };
}
export async function createDoctor(body: any) {
  try {
    let res = await request(`${DEV_API_HOST}/admin/doctor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthority()}`,
      },
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
export async function editDoctor(body: any, id: number) {
  try {
    let res = await request(`${DEV_API_HOST}/admin/doctor/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthority()}`,
      },
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
export async function getListService() {
  const result = await request(`${DEV_API_HOST}/admin/category-service`, {
    method: 'GET',
  });
  return {
    data: result.data,
  };
}
