// 基于BASE64实现文件上传
(function () {
  let upload = document.querySelector('#upload2'),
    upload_inp = upload.querySelector('.upload_inp'),
    upload_button_select = upload.querySelector('.upload_button.select');

  // 选择文件、上传
  upload_inp.addEventListener('change', async function () {
    const file = upload_inp.files[0];
    console.log('file: ', file);
    if (!file) return;
    // 限制大小
    if (file.size > 10 * 1024 * 1024) {
      console.log('大小超限');
      return
    }
    const BASE64 = await changeToBASE64(file);
    upload_button_select.classList.add('loading');
    try {
      const res = await instance.post('/upload_single_base64', {
        file: encodeURIComponent(BASE64),
        filename: file.name,
      }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
      console.log('res: ', res);
      if (+res.code === 0) {
        alert(`文件上传成功，地址 ${res.servicePath}`)
        return
      }
      throw res.codeText
    } catch (error) {
      console.log('error: ', error);
      alert('上传失败 ');
    } finally {
      upload_button_select.classList.remove('loading');
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

  function changeToBASE64(file) {
    return new Promise((resole) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      // 异步，所以要在on里获取
      fileReader.onload = ev => {
        const res = ev.target.result;
        console.log('res: ', res);
        resole(res)
      }
    })
  }
})();