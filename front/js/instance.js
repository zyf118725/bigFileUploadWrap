const instance = axios.create();
instance.defaults.baseURL = 'http://127.0.0.1:8888';
instance.defaults.headers['Content-Type'] = 'multipart/form-data';
instance.defaults.transformRequest = (data, headers) => {
  console.log('instance: ', instance);
  const contantType = headers['Content-Type'];
  console.log('contantType: ', contantType);
  if (contantType === 'application/x-www-form-urlencoded') return Qs.stringify(data);
  return data;
}
// 响应拦截
instance.interceptors.response.use(res => {
  console.log('响应拦截-res: ', res);
  return res.data;
})