import SparkMD5 from 'spark-md5';

// 将图片转为Buffer，并获取文件的hash名 
// 1g大概12s
export function changeToBuffer(file: any) {
  console.log('file: ', file);
  return new Promise((resole) => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    // 异步，所以要在on里获取
    fileReader.onload = (ev: any) => {
      const buffer = ev.target.result;
      // 用SparkMD5根据文件内容生成hash（两个文件只要内容一样如果名字不一样，生成的hash也一样）
      const spark = new SparkMD5.ArrayBuffer();
      spark.append(buffer);
      const HASH = spark.end();
      // 后缀名
      const arr = /\.([a-zA-Z0-9]+)$/.exec(file?.name);
      const suffix = arr && arr[1];
      resole({
        buffer,
        HASH,
        suffix,
        filename: `${HASH}.${suffix}`
      })
    }
  })
}

// 切片 - 1g大概5ms
export function getChunks(file: any, HASH: string, suffix: string) {
  // 实现文件切片-【固定数量 & 固定大小】
  // let max = 1024 * 1000; // 1M
  let max = 512 * 1000; // 1M
  let count = Math.ceil(file.size / max);
  if (count > 100) {
    max = file.size / 100;
    count = 100;
  }
  let index = 0;
  const chunks = [];
  while (index < count) {
    chunks.push({
      file: file.slice(index * max, (index + 1) * max),
      filename: `${HASH}_${index + 1}.${suffix}`,
    });
    index++;
  }
  console.log('切片总数: ', chunks.length);
  return chunks;
}