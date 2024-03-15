import { getAuthority } from '@/common/authority';
import { remove } from '@/common/request';
import { DEV_API_HOST } from '@/const/const';
import { request } from '@umijs/max';
import { message } from 'antd';

export async function getListTag(
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
  const result = await request(`${DEV_API_HOST}/admin/tag`, {
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
export async function getTag(id: number) {
  const result = await request(`${DEV_API_HOST}/admin/tag/${id}`, {
    method: 'GET',
  });
  return {
    data: result,
  };
}
export async function createTag(body: any) {
  try {
    let res = await request(`${DEV_API_HOST}/admin/tag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthority()}`,
      },
      data: { ...body },
    });
    console.log('status:', res?.status);

    if (res?.status === 200) {
      message.success('Thành công');
    }
    return res;
  } catch (error) {
    return false;
  }
}
export async function editTag(body: any, id: number) {
  try {
    console.log('body', body);
    let res = await request(`${DEV_API_HOST}/admin/tag/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthority()}`,
      },
      data: { ...body },
    });
    console.log('res', res);
    if (res?.status === 200) {
      message.success('Thành công');
    }
    return res;
  } catch (error) {
    console.log('error123', error);
    return false;
  }
}
export async function removeTag(id: number) {
  return remove(`admin/tag/${id}`);
}
