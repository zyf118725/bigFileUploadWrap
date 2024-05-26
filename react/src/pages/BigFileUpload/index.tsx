import React, { useEffect, useRef, useState } from 'react'
import { Button, Space, message } from 'antd';
import { getChunks } from '@/utils';
import { uploadAlready, uploadChunkApi, mergeChunkApi, testCancelApi } from '@/utils/api'
import './index.css';
import axios from 'axios';
const CancelToken = axios.CancelToken;
let source = CancelToken.source();

export default function Home() {
  const uploadInp: any = useRef(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [chunksCount, setChunksCount] = useState<number>(0);
  let file: any;

  // 监听web worker
  const worker: any = new Worker(new URL('../../utils/worker.ts', import.meta.url))
  worker.addEventListener('message', (event: any) => {
    const res = event.data;
    uploadChunk(res);
  });

  // 选择文件
  async function iptChange(e: any) {
    file = e.target.files[0];
    setLoading(true);
    // 在web worker中对文件进行格式转化和md5hash命名，
    worker.postMessage(file);
  }

  // 上传切片
  async function uploadChunk(data: any) {
    console.log('上传切片====');
    const HASH = data?.HASH;
    const suffix = data?.suffix;
    // 1. 获取已上传切片信息
    const already: any = await getAlreadySlice(HASH);
    // 获取切片-5ms
    const chunks = getChunks(file, HASH, suffix);
    // 总切片数
    const count = chunks.length;
    setChunksCount(count)
    let curIndex = 0; // 已上传切片数
    // 2. 收集待上传切片
    const waitUploadChunks = chunks.filter((item: any) => !already.includes(item.filename));
    if (waitUploadChunks.length !== count) {
      curIndex = count - waitUploadChunks.length - 1;
      complate()
    }
    // 3. 上传-控制并发请求策略
    sendRequest(waitUploadChunks, 4, complate);

    // 处理切片上传成功
    function complate() {
      curIndex++;
      // 处理进度条
      const progress = (curIndex / count) * 100;
      setProgress(progress);
      // 合并切片
      if (curIndex < count) return;
      mergeSlice(HASH, count)
    }
  }

  // 获取已上传的切片信息
  async function getAlreadySlice(HASH: string) {
    return new Promise(async (resolve, reject) => {
      try {
        console.time();
        const res: any = await uploadAlready({ HASH })
        console.timeEnd();
        console.log('获取已上传的切片信息-res: ', res);
        resolve(res?.fileList || [])
      } catch (error) {
        console.error('error: ', error);
        reject('error')
      }
    })
  }

  // 合并切片
  async function mergeSlice(HASH: string, count: number) {
    console.log('合并切片=========');
    try {
      const res: any = await mergeChunkApi(
        { HASH, count },
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      )
      if (res.code === 0) {
        setTimeout(() => {
          console.log(`文件合并成功, 地址${res.servicePath}`);
          message.success(`文件合并成功, 地址${res.servicePath}`);
        }, 500)
        return
      }
      throw 'error';
    } catch (error) {
      alert('合并失败，请稍后再试');
      console.log('error: ', error);
    } finally {
      stopLoading();
    }
  }

  function stopLoading() {
    setLoading(false);
  }

  // 控制并发请求
  async function sendRequest(list: any, limit: number = 5, callback: () => void) {
    let index = 0;
    let len = list.length;
    let max = limit;
    const start = () => {
      while (index < len && max > 0) {
        max--;
        const item = list[index];
        const formData = new FormData();
        formData.append('file', item.file);
        formData.append('filename', item.filename);
        index++;
        const _index = index;
        uploadChunkApi(formData, { cancelToken: source.token }).then((res: any) => {
          // console.log('上传res-: ', res.originalFilename);
          if (+res.code === 0) {
            callback();
          } else {
            console.error('文件上传失败，请稍后再试');
          }
        }).catch(err => {
          console.error('err: ', err);
        }).finally(() => {
          max++;
          start();
        })
      }
    }
    start();
  }


  // 暂停请求
  function pauseRequest() {
    source.cancel('取消请求操作');
    message.info('上传已暂停');
    setLoading(false);
    // 重置暂停，否则后续无法再次请求
    setTimeout(() => {
      source = CancelToken.source();
    }, 10)
  }

  return (
    <div>
      <div className="container">
        {/* <!-- 7. 大文件上传 --> */}
        <div className="item item7">
          <h3>大文件上传</h3>
          <section className="upload_box" id="upload7">
            <input type="file" className="upload_inp" ref={uploadInp}
              onChange={iptChange}
            />
            <div className="upload_button_box">
              <Button
                type='primary'
                onClick={() => uploadInp.current.click()}
                loading={loading}
              >上传文件</Button>
            </div>
            {progress > 0 &&
              <div className="upload_progress">
                <div className="value" style={{ width: progress + '%' }}></div>
              </div>
            }
            {chunksCount > 0 && <div>切片数量：{chunksCount}</div>}

          </section>
        </div>
        <Space>
          <Button type='primary' className='bigbtn' size='large'
            onClick={() => { console.log('测试用户点击'); }}
          >测试用户点击</Button>
          <Button type='primary' className='bigbtn' size='large'
            onClick={pauseRequest}
          >暂停上传</Button>
        </Space>
      </div>
    </div>
  )
}