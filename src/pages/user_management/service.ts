import { getAuthority } from '@/common/authority';
import { remove } from '@/common/request';
import { request } from '@umijs/max';
import { DEV_API_HOST } from '@/const/const';
import { message } from 'antd';


export async function getListUser(
  params: {
    current?: number;
    pageSize?: number;
    name?: string;
    // role_id?: number;
  },
  options?: { [key: string]: any }
) {
  const result = await request(`${DEV_API_HOST}/api/users/list`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthority()}`,
    },
    params: {
      page: params?.current,
      limit: params?.pageSize,
      name: params?.name,
      // role_id: params?.role_id
    },
    ...(options || {}),
  });
  return {
    data: result.data,
    success: true,
    total: result.total,
  };
}

export async function getListRole() {
  const result = await request(`${API_ENDPOINT}/role/find-all-exclude-pagi`, {
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

export async function createNewUser(body: any){
  try{
    const result = await request(`${API_ENDPOINT}/admin/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthority()}`,
      },
      data: body
    })
    return result;
  } catch (e){
    console.log(e)
  }
}

export async function updateUser(id: number, body: any){
  try{
    const result = await request(`${API_ENDPOINT}/admin/user/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthority()}`,
      },
      data: body
    })
    return result;
  } catch (e){
    console.log(e)
  }
}

export async function getListClinic() {
  let newParams = {
    page: 1,
    limit: 2000
  };
  const result = await request(`${API_ENDPOINT}/admin/clinic/search`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthority()}`,
    },
    params: {
      ...newParams,
    }
  });
  return {
    data: result.data,
  };
}

// export async function getDataForRole() {
//   const result = await request(`${API_ENDPOINT}/role/data-role`, {
//     method: 'GET',
//   });
//   return {
//     data: result,
//   };
// }
// export async function getDataCurrentRole(id: number) {
//     const result = await request(`${API_ENDPOINT}/role/current-role/${id}`, {
//       method: 'GET',
      // headers: {
      //   'Content-Type': 'application/json',
      //   Authorization: `Bearer ${getAuthority()}`,
      // },
//     });
//     return {
//       data: result,
//     };
// }
// export async function createNewRole(body: any){
//   try{
//     const result = await request(`${API_ENDPOINT}/role`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${getAuthority()}`,
//       },
//       data: body
//     })
//     return result;
//   } catch (e){
//     console.log(e)
//   }
// }
// export async function updateRole(id: number, body: any){
//   try{
//     const result = await request(`${API_ENDPOINT}/role/${id}`, {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${getAuthority()}`,
//       },
//       data: body
//     })
//     return result;
//   } catch (e){
//     console.log(e)
//   }
// }
