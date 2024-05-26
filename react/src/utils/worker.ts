/* eslint-disable */
import { changeToBuffer } from '@/utils';

self.addEventListener('message', async (event) => {
  const { data } = event;
  console.log('webworker-接受消息: ', data);
  console.time()
  const HASHRes = await changeToBuffer(data);
  console.timeEnd()
  self.postMessage(HASHRes); // 将计算结果发送回主线程
});