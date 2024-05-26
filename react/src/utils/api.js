import { post, get } from "./request";

export const testApi = (params = {}) => get("/test", params); // 测试接口
export const uploadAlready = (params = {}) => get("/upload_already", params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }); // 查询已上传的切片
export const uploadChunkApi = (params = {}, options) => post("/upload_chunk", params, options); // 上传切片
export const mergeChunkApi = (params = {}, options) => post("/upload_merge", params, options); // 合并切片
export const testCancelApi = (params = {}, options) => post("/slowApiPost", params, {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  ...options
}); // 合并切片


