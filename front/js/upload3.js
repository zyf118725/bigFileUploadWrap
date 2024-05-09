// 缩略图，自动生成文字
(function () {
  let upload = document.querySelector('#upload3'),
    upload_inp = upload.querySelector('.upload_inp'),
    upload_button_select = upload.querySelector('.upload_button.select'),
    upload_button_upload = upload.querySelector('.upload_button.upload'),
    upload_abbre = upload.querySelector('.upload_abbre'),
    upload_abbre_img = upload_abbre.querySelector('img ');
  ;

  // 选择文件、上传
  upload_inp.addEventListener('change', async function () {
    const file = upload_inp.files[0];
    console.log('file: ', file);
    if (!file) return;
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