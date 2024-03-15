import { getAuthority } from '@/common/authority';
import { remove } from '@/common/request';
import { DEV_API_HOST } from '@/const/const';
import { request } from '@umijs/max';
import { message } from 'antd';

export async function getListInformationClinic(
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
  const result = await request(`${DEV_API_HOST}/admin/information_clinic`, {
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

export async function getInformationClinic(id: number) {
  const result = await request(`${DEV_API_HOST}/admin/information_clinic/${id}`, {
    method: 'GET',
  });
  return {
    data: result,
  };
}

export async function createInformationClinic(body: any) {
  try {
    let res = await request(`${DEV_API_HOST}/admin/information_clinic`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthority()}`,
      },
      data: {...body},
    });
    if (res?.status === 200) {
      message.success('Thành công');
    }
    return res;
  } catch (error) {
    return false;
  }
}
export async function editInformationClinic(body: any, id: number) {
  try {
    let res = await request(`${DEV_API_HOST}/admin/information_clinic/${id}`, {
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

export async function removeInformationClinic(id: number) {
  return remove(`admin/information_clinic/${id}`);
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
    page: 1,
    limit: 999,
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
