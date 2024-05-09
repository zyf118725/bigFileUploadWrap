// 基于form-data实现文件上传
(function () {
  let upload = document.querySelector('#upload1'),
    upload_inp = upload.querySelector('.upload_inp'),
    upload_button_select = upload.querySelector('.upload_button.select'),
    upload_button_upload = upload.querySelector('.upload_button.upload'),
    upload_tip = upload.querySelector('.upload_tip'),
    upload_list = upload.querySelector('.upload_list');

  let _file = null;
  console.log('instance: ', instance);

  // 上传操作
  const changeDisable = flag => {
    if (flag) {
      upload_button_upload.classList.add('loading');
      upload_button_select.classList.add('disable');
      return;
    }
    upload_button_upload.classList.remove('loading');
    upload_button_select.classList.remove('disable');
  }
  upload_button_upload.addEventListener('click', function () {
    if (!_file) {
      console.error('请先选择文件');
      return;
    }
    const formData = new FormData();
    formData.append('file', _file);
    formData.append('fileName', _file.name)
    changeDisable(true);
    instance.post('/upload_single', formData).then(res => {
      console.log('res: ', res);
      if (+res.code === 0) {
        alert(`文件上传成功，地址 ${res.servicePath}`)
        return
      }
      return Promise.reject(res)
    }).catch(err => {
      console.error('文件上传失败 ', err);
    }).finally(() => {
      clearHandle()
      changeDisable(true);
    })
  })

  // 处理移除操作
  const clearHandle = () => {
    _file = null;
    upload_tip.style.display = 'block';
    upload_list.style.display = 'none';
    upload_list.innerHTML = ``;
  }
  upload_list.addEventListener('click', function (ev) {
    const target = ev.target;
    if (target.tagName !== 'EM') return;
    clearHandle();
  })

  // 监听用户选择文件的操作
  upload_inp.addEventListener('change', function () {
    const file = upload_inp.files[0];
    console.log('file: ', file);
    if (!file) return;
    // 限制大小
    if (file.size > 10 * 1024 * 1024) {
      console.log('大小超限');
      return
    }
    _file = file;

    upload_tip.style.display = 'none';
    upload_list.style.display = 'block';
    upload_list.innerHTML = `
      <li>
        <span>文件：${file.name}</span>
        <span><em>移除</em></span>
      </li>
    `
  })

  // 选择文件
  const checkIsDisabled = (element) => {
    const classList = element.classList;
    return classList.contains('disable') || classList.contains('loading');
  }
  upload_button_select.addEventListener('click', function () {
    if (checkIsDisabled(this)) return;
    upload_inp.click();
  })

})();

