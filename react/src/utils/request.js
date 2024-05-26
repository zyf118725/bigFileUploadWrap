import axios from 'axios';
// import { getToken } from './auth';
// import { Toast } from 'antd-mobile';

// 配置baseURL
let nodeEnv = process.env.NODE_ENV;
let baseUrl = '';
if (nodeEnv === 'production') {
  baseUrl = 'http://10.33.31.9:8100'; // 线上
} else if (nodeEnv === 'testBuild') {
  baseUrl = 'http://127.0.0.1:8888'; // 测试
} else {
  baseUrl = 'http://127.0.0.1:8888'; // 测试
  // baseUrl = '/api'; // 开发
}

const instance = axios.create({
  baseURL: baseUrl,
  timeout: 100000
})

// 请求拦截
instance.interceptors.request.use(function (config) {
  // config.headers['Content-Type'] = 'multipart/form-data'; 
  // config.headers['Content-Type'] = 'multipart/form-data'; 
  return config;
}, function (error) {
  console.log('请求失败拦截-err: ', error);
  return Promise.reject(error);
});

// 响应拦截
instance.interceptors.response.use(function (response) {
  // console.log('响应拦截-suc');
  return response.data;
}, function (error) {
  // Toast.info('响应拦截-err');
  console.log('响应拦截-err', error);
  return Promise.reject(error);
});

export function get(url, params = {}) {
  return instance.get(url, {
    params
  })
}

export function post(url, data, options) {
  return instance.post(url, data, options)
}

export function put(url, data) {
  return instance.put(url, data)
}

export function del(url) {
  return instance.put(url)
}