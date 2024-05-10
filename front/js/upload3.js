// 缩略图，自动生成文字
(function () {
  let upload = document.querySelector('#upload3'),
    upload_inp = upload.querySelector('.upload_inp'),
    upload_button_select = upload.querySelector('.upload_button.select'),
    upload_button_upload = upload.querySelector('.upload_button.upload'),
    upload_abbre = upload.querySelector('.upload_abbre'),
    upload_abbre_img = upload_abbre.querySelector('img ');
  ;

  let _file = null;

  // 处理按钮状态
  const changeDisable = flag => {
    if (flag) {
      upload_button_upload.classList.add('loading');
      upload_button_select.classList.add('disable');
      return;
    }
    upload_button_upload.classList.remove('loading');
    upload_button_select.classList.remove('disable');
  }

  // 上传
  upload_button_upload.addEventListener('click', async function () {
    if (checkIsDisabled(this)) return;
    console.log("上传");
    if (!_file) {
      console.error('请先选择文件');
      return;
    }
    // 生成文件的hash名
    const { filename } = await changeToBuffer(_file);
    const formData = new FormData();
    formData.append('file', _file);
    formData.append('filename', filename)
    changeDisable(true);
    instance.post('/upload_single_name', formData).then(res => {
      console.log('res: ', res);
      if (+res.code === 0) {
        alert(`文件上传成功，地址 ${res.servicePath}`)
        return
      }
      return Promise.reject(res)
    }).catch(err => {
      console.error('文件上传失败 ', err);
    }).finally(() => {
      changeDisable(false);
    })
  })

  // 选择文件
  upload_inp.addEventListener('change', async function () {
    const file = upload_inp.files[0];
    console.log('file: ', file);
    if (!file) return;
    _file = file;
    // 显示缩略图：将图片转为base64, 将bases64赋给imgsrc
    const BASE64 = await changeToBASE64(file);
    upload_abbre.style.display = 'block';
    upload_abbre_img.src = BASE64;
  })

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

  // 将图片转为base64
  function changeToBASE64(file) {
    return new Promise((resole) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      // 异步，所以要在on里获取
      fileReader.onload = ev => {
        const res = ev.target.result;
        resole(res)
      }
    })
  }

  // 将图片转为Buffer，并获取文件的hash名
  function changeToBuffer(file) {
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