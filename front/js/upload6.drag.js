(function () {
  let upload = document.querySelector('#upload6'),
    upload_inp = upload.querySelector('.upload_inp'),
    upload_submit = upload.querySelector('.upload_submit'),
    upload_mark = upload.querySelector('.upload_mark');

  // 上传文件
  async function uploadFile(file) {
    console.log('file: ', file);
    upload_mark.style.display = 'block';
    try {
      const fm = new FormData();
      fm.append('file', file);
      fm.append('filename', file.name);
      const res = await instance.post('/upload_single', fm);
      console.log('res: ', res);
      if (+res.code === 0) {
        alert(`文件上传成功，地址 ${res.servicePath}`)
        return
      }
      throw error;
    } catch (error) {
      console.log('error: ', error);
      alert('文件上传失败');
    } finally {
      upload_mark.style.display = 'none';
    }
  }

  // 拖拽上传 dragenter dragleave dragover drop
  // upload.addEventListener('dragenter', (e) => { console.log('进入') })
  // upload.addEventListener('dragleave', (e) => { console.log('离开') })
  upload.addEventListener('dragover', (e) => { e.preventDefault() })
  upload.addEventListener('drop', function (e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    uploadFile(file);
  })

  // 手动选择文件
  upload_inp.addEventListener('change', function () {
    const file = upload_inp.files[0];
    if (!file) {
      alert('请选择文件');
      return;
    }
    uploadFile(file);
  })

  // 上传按钮-假
  upload_submit.addEventListener('click', function () {
    console.log('上传按钮-假');
    upload_inp.click();
  })
})()