// import type { RequestConfig } from '@umijs/max';
import { message } from 'antd';

// 错误处理方案： 错误类型

export const errorConfig = {
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {
      console.log('res', res);
      const { success, data, errorCode, errorMessage, showType } = res;
      if (!success) {
        const error = new Error(errorMessage);
        error.name = 'BizError';
        error.info = { errorCode, errorMessage, showType, data };
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error, opts) => {
      console.log('error', error);
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      console.log('error', error);
      if (error.name === 'AxiosError') {
        if (error.code === 'ERR_NETWORK') {
          message.error(`Lỗi: ${error.message}`);
        } else {
          message.error(`Lỗi: ${error.response.status} ${error.response.statusText}`);
        }
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        message.error(`Response status:${error.response.status}`);
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error('None response! Please retry.');
      } else {
        // 发送请求时出了点问题
        message.error('Request error, please retry.');
      }
    },
  },

  // 请求拦截器
  // requestInterceptors: [
  //   (config: RequestOptions) => {
  //     // 拦截请求配置，进行个性化处理。
  //     const url = config?.url?.concat('?token = 123');
  //     return { ...config, url };
  //   },
  // ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 拦截响应数据，进行个性化处理
      const { data } = response;
      
      
      if (data?.status === 400) {
        if (Array.isArray(data?.error)) {
          message.error(
            `${data?.message}: ${data?.error[0].field} ${data?.error[0].errorDescription}`,
          );
        } else {
          message.error(`${data?.message}: ${data?.error.name}`);
        }
          
      }
      return response;
    },
  ],
};
