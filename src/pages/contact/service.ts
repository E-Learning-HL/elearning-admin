import { getAuthority } from '@/common/authority';
import { DEV_API_HOST } from '@/const/const';
import { request } from '@umijs/max';
import { message } from 'antd';
import {remove} from "@/common/request";

export async function createContact(body: any) {
  try {
    let res = await request(`${DEV_API_HOST}/contact`, {
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

export async function getListContact(
  params: {
    current?: number;
    pageSize?: number;
    customer_name?: string;
    province_id?: string
  },
  options?: { [key: string]: any },
) {
  console.log('params', params);
  let newParams = {
    page: params.current,
    limit: params.pageSize,
    customer_name: params.customer_name,
    province_id: params.province_id
  };
  const result = await request(`${DEV_API_HOST}/contact`, {
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
  };
}

export async function removeContact(id: number) {
  return remove(`contact/${id}`);
}

export async function getContact(id: number) {
  const result = await request(`${DEV_API_HOST}/contact/${id}`, {
    method: 'GET',
  });
  return {
    data: result,
  };
}

export async function editContact(body: any, id: number) {
  try {
    let res = await request(`${DEV_API_HOST}/contact/${id}`, {
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

export async function getListService() {
  const result = await request(`${DEV_API_HOST}/admin/category-service`, {
    method: 'GET',
  });
  return {
    data: result.data,
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
