$('.upload-file').change(function changeFile() {
  const id = $(this).attr('id');
  const file = document.getElementById(id).files[0];
  const size = document.getElementById(id).files[0].size / 1024 / 1024;
  const maxFileSize = 100; // in MB, note this in .htaccess as well
  const isBackgroundUpload = ($(this).attr('id') === 'uploadfile');
  if (size > maxFileSize) {
    alert(`Die Datei ist zu groß. Es sind maximal ${maxFileSize} MB erlaubt.\n\nSchicke Dir die Datei per z.B. WhatsApp zu, dann wird sie automatisch verkleinert. Mehr als 20 MB pro Minute Video braucht es nicht.`);
    return false;
  }

  $('#canvas-area').slideUp();
  $('#waiting').show();
  $(this).prop('disabled', true);

  const formData = new FormData();
  const client = new XMLHttpRequest();

  const startUploadTime = Date.now();

  if (!file) {
    return false;
  }

  formData.append('file', file);
  formData.append('id', id);
  formData.append('csrf', config.csrf);

  client.onerror = function onError(e) {
    console.log('onError', e);
  };

  client.onload = function onLoad(e) {
    const obj = JSON.parse(e.target.response);

    if (obj.originalWidth > 4000 || obj.originalHeight > 4000) {
      $('.upload-too-big').toast('show');
    }

    $(`#${id}`).prop('disabled', false);
    $('#waiting').hide();
    $('#canvas-area').slideDown();

    if (obj.error) {
      alert('Es ist ein Fehler beim Upload aufgetreten. Bitte versuche, ein jpg-Bild hochzuladen.');
      console.log(obj.error);
      return false;
    }

    if (isBackgroundUpload) {
      config.video = (obj.video === 1);
    }

    if (obj.video === 1) {
      config.videofile = obj.videofile;
      config.filename = obj.filename;
      config.videoduration = obj.videoduration;
      $('#width').val(obj.originalWidth);
      $('#height').val(obj.originalHeight);
      $('#graybackground').val(1);
      $('#blurbackground').val(0);
      $('#darklightlayer').val(0);
      $('#greenlayer').val(0);
    }

    redrawCockpit();

    switch (id) {
      case 'uploadfile':
        show('show-copyright');
        config.uploadTime = Date.now() - startUploadTime;
        afterUpload(obj);
        break;
      case 'uploadlogo':
        $('#logoselect').append(new Option('Eigenes Logo', 'custom'));
        $('#logoselect').val('custom');
        logo.load();
        break;
      case 'uploadicon':
        $('#iconfile').val(obj.iconfile);
        icon.load();
        $('.iconsizeselectwrapper').removeClass('d-none');
        break;
      case 'uploadaddpic1':
        $('#addpicfile1').val(obj.addpicfile);
        show('show-add-pic-1');
        show('show-copyright');
        show('show-add-pic-upload');
        $('.retoggle').bootstrapToggle('destroy').bootstrapToggle();
        addPic1.draw();
        break;
      case 'uploadaddpic2':
        $('#addpicfile2').val(obj.addpicfile);
        show('show-add-pic-2');
        show('show-copyright');
        $('.retoggle').bootstrapToggle('destroy').bootstrapToggle();
        addPic2.draw();
        break;
      case 'uploadwork':
        {
          const json = JSON.parse(obj.data);
          if (json.addpicfile1 !== '') { json.addpicfile1 = `../${obj.dir}/${json.addpicfile1}`; }
          if (json.addpicfile2 !== '') { json.addpicfile2 = `../${obj.dir}/${json.addpicfile2}`; }
          uploadFileByUrl(`${obj.dir}/${json.savedBackground}`, () => {
            loadFormData(json);
          });
        }
        break;
      default:
        console.log('error in upload', obj);
    }
    return true;
  };

  client.upload.onprogress = function onProgress(e) {
    const p = Math.round((100 / e.total) * e.loaded);

    if (p < 95) {
      $('#uploadpercentage').html(p);
    } else {
      $('#uploadstatus').html('Dein Bild wird verarbeitet...');
      $('#beinguploaded').hide();
    }
  };

  client.onabort = function onAbort() {
    console.log('Upload abgebrochen');
  };

  client.open('POST', '/actions/upload.php');
  client.send(formData);
  return true;
});

function uploadFileByUrl(url, callback = function uploadCallback() {}) {
  $('#waiting').show();
  $('#canvas-area').slideUp();
  const id = 'uploadbyurl';

  const formData = new FormData();
  const client = new XMLHttpRequest();
  formData.append('id', id);
  formData.append('url2copy', url);
  formData.append('csrf', config.csrf);

  client.onerror = function onError(e) {
    console.log('onError', e);
  };

  client.upload.onprogress = function onProgress(e) {
    const p = Math.round((100 / e.total) * e.loaded);

    if (p < 95) {
      $('#uploadpercentage').html(p);
    } else {
      $('#uploadstatus').html('Dein Bild wird verarbeitet...');
      $('#beinguploaded').hide();
    }
  };

  client.onload = function onLoad(e) {
    const obj = JSON.parse(e.target.response);

    $('#waiting').hide();
    $('#canvas-area').slideDown();

    if (obj.error) {
      console.log(obj);
    }

    config.filename = obj.filename;
    config.video = (obj.video === 1);
    if (obj.video === 1) {
      config.videofile = obj.videofile;
      config.filename = obj.filename;
      config.videoduration = obj.videoduration;

      $('#width').val(obj.originalWidth);
      $('#height').val(obj.originalHeight);
    }

    redrawCockpit();

    afterUpload(obj);
    callback();
  };

  client.open('POST', '/actions/upload.php');
  client.send(formData);
}

function afterUpload(data) {
  draw.size(data.width, data.height);
  info.originalWidth = data.originalWidth;
  info.originalHeight = data.originalHeight;
  info.previewWidth = draw.width();
  info.previewHeight = draw.height();

  $('#backgroundURL').val(data.filename);

  // resize after bg upload
  $('#width').val(data.originalWidth);
  $('#height').val(data.originalHeight);

  $('#fullBackgroundName').val(data.fullBackgroundName);

  setDrawsize();

  // unselect presets
  $('#sizepresets').val($('#sizepresets option:first').val());

  background.draw();
  if (data.faces === undefined) {
    config.faces = -1;
  } else {
    config.faces = data.faces;
  }

  if (data.faces > 0) {
    $('.face-alert').toast('show');
  }

  config.backgroundSource = 'upload';
}

$('.uploadfileclicker').click(() => {
  $('#uploadfile').click();
});

$('.uploadlogoclicker').click(() => {
  $('#uploadlogo').click();
});

$('.uploadiconclicker').click(() => {
  $('#uploadicon').click();
});
$('.uploadworkclicker').click(() => {
  document.getElementById('pic').reset();
  reDraw();
  $('#uploadwork').click();
});

$('.addpicclicker1').click(() => {
  $('#uploadaddpic1').click();
});
$('.addpicclicker2').click(() => {
  $('#uploadaddpic2').click();
});
