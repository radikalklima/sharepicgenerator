const addPic99 = { ...addPic1 };
addPic99.i = 99;

$('#addPicSize99').bind('input propertychange', () => { addPic99.resize(); });
$('#addpicrounded1').bind('change', () => { addPic1.draw(); });
$('#addpicroundedbordered1').bind('change', () => { addPic1.draw(); });
$('#addpicdelete99').bind('click', () => { addPic99.delete(); });

// eslint-disable-next-line no-unused-vars
function setIcon(file) {
  // eslint-disable-next-line no-param-reassign
  file = `../../tenants/frankfurt/${file}`;
  $('#addpicfile99').val(file);
  show('show-add-pic-99');
  show('show-add-pic-upload');
  $('.retoggle').bootstrapToggle('destroy').bootstrapToggle();

  if ($('#addPic99x').val() === '') {
    $('#addPic99x').val(463);
    $('#addPic99y').val(160);
    $('#addPicSize99').val(36);
  }

  addPic99.draw();
}
