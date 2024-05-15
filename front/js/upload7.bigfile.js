
// 大文件切片上传
(function () {
  let upload = document.querySelector('#upload7'),
    upload_inp = upload.querySelector('.upload_inp'),
    upload_button_select = upload.querySelector('.upload_button.select'),
    upload_progress = upload.querySelector('.upload_progress'),
    upload_progress_value = upload_progress.querySelector('.value');

  // 选择文件,上传
  upload_inp.addEventListener('change', async function () {
    const file = upload_inp.files[0];
    if (!file) return;
    upload_button_select.classList.add('loading');
    upload_progress.style.display = 'block';
    console.time()
    const { HASH, suffix } = await changeToBuffer(file);
    console.log('文件转化时间：');
    console.timeEnd()

    // 获取已上传的切片列表
    const already = await getAlreadySlice(HASH);
    console.log('already: ', already);
    // 获取切片
    console.time()
    const chunks = getChunks(file, HASH, suffix);
    console.log('切片时长: ');
    console.timeEnd()

    // console.log('chunks: ', chunks);
    // 总切片数
    const count = chunks.length;
    let curIndex = 0; // 已上传切片数

    // 上传
    chunks.forEach(async (item, index) => {
      if (already.includes(item.filename)) {
        console.log('已上传');
        complate();
        return;
      }
      const formData = new FormData();
      formData.append('file', item.file);
      formData.append('filename', item.filename);
      instance.post('/upload_chunk', formData).then(res => {
        // console.log('res: ', res);
        if (+res.code === 0) {
          complate();
          return
        }
        return Promise.reject('error');
      }).catch(err => {
        console.log('文件上传失败，请稍后再试');
        console.log('err: ', err);
        clear();
      });
    })

    // 处理切片上传成功
    function complate() {
      curIndex++;
      // 处理进度条
      const progress = (curIndex / count) * 100 + '%';
      // console.log('上传进度-progress: ', progress);
      upload_progress_value.style.width = progress;
      // 合并切片
      if (curIndex < count) return;
      upload_progress_value.style.width = progress;
      mergeSlice(HASH, count)
    }
  })

  // 合并切片
  async function mergeSlice(HASH, count) {
    try {
      const res = await instance.post('/upload_merge',
        { HASH, count },
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      )
      if (res.code === 0) {
        setTimeout(() => {
          alert(`文件合并成功, 地址${res.servicePath}`);
        }, 500)
        clear();
        return
      }
      throw 'error';
    } catch (error) {
      alert('合并失败，请稍后再试', error);
      console.log('error: ', error);
      clear();
    }
  }

  // 清理进度，还原上传按钮
  function clear() {
    upload_button_select.classList.remove('loading');
    upload_progress.style.display = 'none';
    upload_progress_value.style.width = '0%';
  }

  // 获取已上传的切片信息
  async function getAlreadySlice(HASH) {
    return new Promise(async (resolve) => {
      try {
        let res = await instance.get('/upload_already', { params: { HASH } })
        console.log('获取已上传的切片信息-res: ', res);
        resolve(res?.fileList || [])
      } catch (error) {
        reject('error')
      }
    })
  }

  // 切片
  function getChunks(file, HASH, suffix) {
    // 实现文件切片-【固定数量 & 固定大小】
    let max = 1024 * 1000; // 1M
    let count = Math.ceil(file.size / max);
    if (count > 100) {
      max = file.size / 100;
      count = 100;
    }
    let index = 0;
    console.time();
    const chunks = [];
    while (index < count) {
      chunks.push({
        file: file.slice(index * max, (index + 1) * max),
        filename: `${HASH}_${index + 1}.${suffix}`,
      });
      index++;
    }
    console.timeEnd('');

    return chunks;
  }

  // 检测按钮是否可点击
  const checkIsDisabled = (element) => {
    const classList = element.classList;
    return classList.contains('disable') || classList.contains('loading');
  }

  // 选择文件
  upload_button_select.addEventListener('click', function () {
    if (checkIsDisabled(this)) return;
    upload_inp.click();
  })

  // 将图片转为Buffer，并获取文件的hash名
  function changeToBuffer(file) {
    console.log('file: ', file);
    return new Promise((resole) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      // 异步，所以要在on里获取
      fileReader.onload = ev => {
        const buffer = ev.target.result;
        // 用SparkMD5根据文件内容生成hash（两个文件只要内容一样如果名字不一样，生成的hash也一样）
        const spark = new SparkMD5.ArrayBuffer();
        spark.append(buffer);
        const HASH = spark.end();
        // 后缀名
        const suffix = /\.([a-zA-Z0-9]+)$/.exec(file.name)[1];
        resole({
          buffer,
          HASH,
          suffix,
          filename: `${HASH}.${suffix}`
        })
      }
    })
  }
})();