// 展示上传进度
(function () {
  let upload = document.querySelector('#upload4'),
    upload_inp = upload.querySelector('.upload_inp'),
    upload_button_select = upload.querySelector('.upload_button.select'),
    upload_progress = upload.querySelector('.upload_progress'),
    upload_progress_value = upload_progress.querySelector('.value');
  ;

  // 选择文件
  upload_inp.addEventListener('change', async function () {
    const file = upload_inp.files[0];
    if (!file) return;
    upload_button_select.classList.add('loading');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', file.name);
      const res = await instance.post('/upload_single', formData, {
        // 文件上传中的回调函数 xhr.upload.onprogress
        onUploadProgress(e) {
          const { loaded, total } = e;
          const progress = loaded / total * 100 + '%';
          console.log('progress: ', progress);
          upload_progress.style.display = 'block';
          upload_progress_value.style.width = progress;
        }
      });
      console.log('res: ', res);
      if (res.code === 0) {
        upload_progress_value.style.width = '100%';
        alert(`文件上传成功，地址 ${res.servicePath}`)
        return;
      }
      throw error
    } catch (error) {
      alert('文件上传失败')
    } finally {
      upload_button_select.classList.remove('loading');
      upload_progress.style.display = 'none';
      upload_progress_value.style.width = 0;
    }
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

})();