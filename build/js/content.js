$(function() {
  var getToken, save2Server;
  getToken = function() {
    return new Promise(function(resolve, reject) {
      var keys;
      keys = ['token'];
      return chrome.storage.sync.get(keys, function(item) {
        console.log(item);
        if (item.token === void 0 || item.token === '') {
          return reject(void 0);
        }
        return resolve(item.token);
      });
    });
  };
  save2Server = function(post) {
    var destUrl;
    destUrl = 'http://127.0.0.1:9021/api/posts';
    return getToken().then(function(token) {
      console.log(token);
      return $.ajax({
        type: "POST",
        url: destUrl,
        data: {
          token: token,
          post: post
        },
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      }).done(function(data) {
        console.log(data);
        chrome.runtime.sendMessage({
          "newIconPath": 'build/images/blue/icon19.png'
        });
        return alertify.success("保存しました。");
      }).fail(function(err) {
        return console.log(err);
      });
    })["catch"](function(err) {
      console.log(err);
      return alertify.error("トークンに誤りがあります。\nもう一度確認してみてください。");
    });
  };
  return (function() {
    var data, description1, description2, favicon, hostName, siteImage, siteName, siteUrl1, siteUrl2, title1, title2;
    alertify.log("保存中 ......");
    data = {};
    console.log('=============>');
    console.log('=======> info');
    console.log(info);
    console.log('=======> タイトル');
    console.log(title1 = $('head title').text());
    console.log(title2 = $('meta[property="og:title"]').attr('content'));
    data.title = title1 || title2;
    console.log('=======> サイトの名前');
    console.log(siteName = $('meta[property="og:site_name"').text());
    data.siteName = siteName;
    console.log('=======> サイトのURL');
    console.log(siteUrl1 = $(location).attr('href'));
    console.log(siteUrl2 = $('meta[property="og:url"]').attr('content'));
    data.siteUrl = siteUrl1 || siteUrl2;
    if (((typeof info !== "undefined" && info !== null ? info.mediaType : void 0) != null) && info.mediaType === 'image') {
      data.url = info.srcUrl;
      data.type = 'image';
    } else {
      data.url = data.siteUrl;
      data.type = 'link';
    }
    console.log(hostName = location.host);
    data.hostName = hostName;
    console.log('=======> 説明');
    console.log(description1 = $('meta[name="description"]').attr('content'));
    console.log(description2 = $('meta[property="og:description"]').attr('content'));
    data.description = description1 || description2;
    console.log('=======> サイトの画像');
    console.log(siteImage = $('meta[property="og:image"]').attr('content'));
    data.siteImage = siteImage;
    console.log('=======> faviconのURL');
    console.log(favicon = $('link[rel="shortcut icon"]').prop('href'));
    data.favicon = favicon;
    data.isPrivate = true;
    data.isArchive = false;
    console.log(data);
    return save2Server(data);
  })();
});
