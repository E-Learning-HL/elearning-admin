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
    // role_id?: number;
  },
  options?: { [key: string]: any }
) {
  const result = await request(`${DEV_API_HOST}/api/payments/get-list`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthority()}`,
    },
    params: {
      page: params?.current,
      limit: params?.pageSize,
      search: params?.name,
      // role_id: params?.role_id
    },
    ...(options || {}),
  });
  console.log("123123", result.data)
  return {
    data: result.data,
    success: true,
    total: result.total,
  };
}

export async function getInformationClinic(id: number) {
  const result = await request(`${DEV_API_HOST}/api/payments/{id}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthority()}`,
    },
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
export async function editInformationPayment(body: any, id: number) {
  try {
    let res = await request(`${DEV_API_HOST}/api/payments/update-payment/${id}`, {
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
