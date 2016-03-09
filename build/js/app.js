$(function() {
  chrome.storage.sync.get("token", function(item) {
    return $("#token").val(item.token);
  });
  return $("#token").on("keyup", function() {
    var item, token;
    token = $("#token").val();
    item = {
      token: token
    };
    return chrome.storage.sync.set(item, function() {
      return $('#console').html((moment().format('YYYY MMMM Do, h:mm:ss')) + ": トークンを保存しました");
    });
  });
});
