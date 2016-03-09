$(function() {
  var displatyFailedResult, displatySuccessResult, getToken, save2Server, scrapingMetaData;
  save2Server = function(data, token) {
    return new Promise(function(resolve, reject) {
      var destUrl;
      destUrl = 'https://127.0.0.1:9021/api/posts';
      return $.ajax({
        type: "POST",
        url: destUrl,
        data: {
          token: token,
          post: data
        },
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      }).done(function(data, status) {
        console.log(data);
        console.log(status);
        return resolve(data);
      }).fail(function(err) {
        return reject(err);
      });
    });
  };
  getToken = function() {
    return new Promise(function(resolve, reject) {
      return chrome.storage.sync.get(['token'], function(item) {
        if (item.token === void 0 || item.token === '') {
          return reject(void 0);
        }
        return resolve(item.token);
      });
    });
  };
  scrapingMetaData = function() {
    return new Promise(function(resolve, reject) {
      var $img, DEFUALT_URL, data, description1, description2, favicon, firstImgUrlInBody, hostName, siteImage, siteName, siteUrl1, siteUrl2, title1, title2;
      data = {};
      title1 = $('head title').text();
      title2 = $('meta[property="og:title"]').attr('content');
      data.title = (typeof info !== "undefined" && info !== null ? info.title : void 0) || title1 || title2;
      siteName = $('meta[property="og:site_name"').text();
      data.siteName = siteName;
      siteUrl1 = $(location).attr('href');
      siteUrl2 = $('meta[property="og:url"]').attr('content');
      data.siteUrl = (typeof info !== "undefined" && info !== null ? info.siteUrl : void 0) || siteUrl1 || siteUrl2;
      console.log('info =  ', info);
      console.log('info?.type =  ', typeof info !== "undefined" && info !== null ? info.type : void 0);
      console.log('info?.type? =  ', (typeof info !== "undefined" && info !== null ? info.type : void 0) != null);
      console.log('info?.type? is image =  ', ((typeof info !== "undefined" && info !== null ? info.type : void 0) != null) === 'image');
      if ((typeof info !== "undefined" && info !== null ? info.type : void 0) === 'image' || ((typeof info !== "undefined" && info !== null ? info.mediaType : void 0) != null) && (typeof info !== "undefined" && info !== null ? info.menuItemId : void 0) === 'image') {
        data.type = 'image';
        data.url = info.srcUrl;
      } else {
        data.type = 'link';
        $img = $('img');
        DEFUALT_URL = 'https://36.media.tumblr.com/9086462174c34becaf8b3e59de8f5800/tumblr_nzek2kWNNJ1ukgdjoo2_1280.jpg';
        if (($img != null) && $img.length > 0) {
          console.log('画像ファイル発見', $img);
          firstImgUrlInBody = $img.get(0).src;
          data.url = firstImgUrlInBody || DEFUALT_URL;
        } else {
          console.log('画像ファイルが見つからない。');
          data.url = DEFUALT_URL;
        }
        if (data.url.indexOf("chrome-extension://") > -1) {
          console.log('ChromeExnteionsファイルを画像に設定されてしまった。');
          data.url = $img.get(1).src;
        }
        if (siteUrl1.indexOf("www.nicovideo.jp/watch/sm") > -1) {
          data.url = $('.videoThumbnailImage').attr('src');
        }
        if (siteUrl1.indexOf("xvideos.com/video") > -1) {
          data.url = $('img.thumb').attr('src');
        }
      }
      hostName = location.host;
      data.hostName = hostName;
      description1 = $('meta[name="description"]').attr('content');
      description2 = $('meta[property="og:description"]').attr('content');
      data.description = description1 || description2;
      siteImage = $('meta[property="og:image"]').attr('content');
      data.siteImage = siteImage;
      favicon = $('link[rel="shortcut icon"]').prop('href');
      data.favicon = favicon;
      data.isPrivate = true;
      data.isArchive = false;
      console.log(data);
      return resolve(data);
    });
  };
  displatySuccessResult = function() {
    chrome.runtime.sendMessage({
      "newIconPath": 'build/images/blue/icon19.png'
    });
    return alertify.success("保存しました。");
  };
  displatyFailedResult = function(err) {
    console.log('displatyFailedResult err = ', err);
    if (err.responseJSON != null) {
      err.statusCode = err.responseJSON.statusCode;
      err.statusMessage = err.responseJSON.message;
    } else if (err.status != null) {
      err.statusCode = err.status;
      err.statusMessage = err.statusText;
    }
    if (err.statusCode) {
      return alertify.error("Error: " + err.statusCode + " " + err.statusMessage);
    } else {
      return alertify.error("Error: トークンに誤りがあります。\nもう一度確認してみてください。");
    }
  };
  return (function() {
    alertify.log("保存中 ......");
    return Promise.all([scrapingMetaData(), getToken()]).then(function(arg) {
      var data, token;
      data = arg[0], token = arg[1];
      return save2Server(data, token);
    }).then(function(data) {
      return displatySuccessResult();
    })["catch"](function(err) {
      return displatyFailedResult(err);
    });
  })();
});
