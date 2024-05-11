// 缩略图，自动生成唯一名
(function () {
  let upload = document.querySelector('#upload5'),
    upload_inp = upload.querySelector('.upload_inp'),
    upload_button_select = upload.querySelector('.upload_button.select'),
    upload_button_upload = upload.querySelector('.upload_button.upload'),
    upload_list = upload.querySelector('.upload_list');
  let _files = [];

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
    console.log('_files: ', _files);
    if (_files.length === 0) {
      console.error('请先选择文件');
      return;
    }
    changeDisable(true);
    // 循环发送请求，并检测上传进度
    const upload_list_arr = Array.from(upload_list.querySelectorAll('li'));
    _files = _files.map((file, i) => {
      const fm = new FormData();
      const li = upload_list_arr[i];
      const span = li.querySelector('span:nth-child(2)');
      fm.append('file', file);
      fm.append('filename', file.name);
      return instance.post('/upload_single', fm, {
        onUploadProgress: function (e) {
          const percent = Math.floor((e.loaded / e.total) * 100) + '%';
          console.log('percent: ', percent);
          if (span) span.innerHTML = percent;
        }
      }).then(res => {
        if (+res.code === 0) {
          console.log('上传成功');
          if (span) span.innerHTML = '100%';
          return
        }
        return Promise.reject(res);
      });
    })

    Promise.allSettled(_files).then(res => {
      console.log('res: ', res);
      alert('上传成功')
      changeDisable(false);
    }).catch(err => {
      alert('上传失败')
    }).finally(() => {
      changeDisable(false);
      _files = [];
      upload_list.innerHTML = '';
      upload_list.style.display = 'none';
    })
  })

  // 选择文件
  upload_inp.addEventListener('change', async function () {
    _files = Array.from(upload_inp.files);
    console.log('_files: ', _files);
    if (!_files.length === 0) return;
    let str = '';
    _files.forEach(file => {
      str += `
        <li>
          <span>文件：${file.name}</span>
          <span><em>移除</em></span>
        </li>`
    })
    upload_list.style.display = 'block';
    upload_list.innerHTML = str;
  })

  // 移除文件
  upload_list.addEventListener('click', function (e) {
    if (e.target.tagName === 'EM') {
      const index = e.target.parentNode.parentNode.getAttribute('data-index');
      console.log('index: ', index);
      _files.splice(index, 1);
      upload_list.removeChild(e.target.parentNode.parentNode);
      console.log('_files: ', _files);
    };
  })

  // 检测按钮是否可点击
  const checkIsDisabled = (element) => {
    const classList = element.classList;
    return classList.contains('disable') || classList.contains('loading');
  }

  // 控制选择文件按钮
  upload_button_select.addEventListener('click', function () {
    if (checkIsDisabled(this)) return;
    upload_inp.click();
  })
})();