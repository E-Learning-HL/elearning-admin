import { DEV_API_HOST } from '@/const/const';
import { request } from '@umijs/max';
import { getAuthority } from './authority';
import { message } from 'antd';

export async function remove(url: string) {
  try {
    let res = await request(`${DEV_API_HOST}/${url}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthority()}`,
      },
    });
    if (res?.status === 200) {
      message.success('Thành công');
    }
    return res;
  } catch (error) {
    return false;
  }
}
