(function() {
  var getHtmlToInsert, getParamsToServer, getSelectorInsertionTagetOfKawpaaLink, sendBackground, showKawpaaLink;
  getSelectorInsertionTagetOfKawpaaLink = function() {
    var hostname, result;
    result = null;
    hostname = location.host;
    switch (hostname) {
      case 'chan.sankakucomplex.com':
        result = '#share';
        break;
      case 'danbooru.donmai.us':
        result = '#post-sections';
        break;
      case 'gelbooru.com':
      case 'konachan.com':
      case 'yande.re':
        result = '#right-col h4';
    }
    return result;
  };
  getHtmlToInsert = function() {
    var hostname, result;
    result = null;
    hostname = location.host;
    switch (hostname) {
      case 'chan.sankakucomplex.com':
        result = "<a class=\"kawpaa-save-link\" href=\"#\">Save to Kawpaa</a>";
        break;
      case 'danbooru.donmai.us':
        result = "<li><a class=\"kawpaa-save-link\" href=\"#\">Save to Kawpaa</a></li>";
        break;
      case 'gelbooru.com':
      case 'konachan.com':
      case 'yande.re':
        result = " |\n<a class=\"kawpaa-save-link\" href=\"#\">Save to Kawpaa</a>";
    }
    return result;
  };
  showKawpaaLink = function() {
    var html, selector;
    selector = getSelectorInsertionTagetOfKawpaaLink();
    html = getHtmlToInsert();
    return $(document).find(selector).append(html);
  };
  sendBackground = function(params) {
    console.log(params);
    return chrome.runtime.sendMessage(params, function(response) {
      return console.log(response);
    });
  };
  getParamsToServer = function() {
    var hostname, originalImageSrc, result, sampleImgUrl, srcUrl;
    result = null;
    hostname = location.host;
    console.log(hostname);
    switch (hostname) {
      case 'chan.sankakucomplex.com':
        sampleImgUrl = $('#image').attr('src');
        sampleImgUrl = sampleImgUrl.replace('sample-', '');
        originalImageSrc = sampleImgUrl.replace('/sample', '');
        srcUrl = "https:" + originalImageSrc;
        result = {
          name: 'sankakucomplex',
          info: {
            type: 'image',
            srcUrl: srcUrl
          }
        };
        break;
      case 'danbooru.donmai.us':
        sampleImgUrl = $('#image').attr('src');
        originalImageSrc = sampleImgUrl.replace('sample/sample-', '');
        srcUrl = "https://danbooru.donmai.us" + originalImageSrc;
        result = {
          name: 'danbooru',
          info: {
            type: 'image',
            srcUrl: srcUrl
          }
        };
        break;
      case 'gelbooru.com':
        originalImageSrc = $('#image').attr('src');
        srcUrl = originalImageSrc;
        result = {
          name: 'gelbooru',
          info: {
            type: 'image',
            srcUrl: srcUrl
          }
        };
        break;
      case 'konachan.com':
        originalImageSrc = $('#image').attr('src');
        srcUrl = originalImageSrc;
        result = {
          name: 'konachan',
          info: {
            type: 'image',
            srcUrl: srcUrl
          }
        };
        break;
      case 'yande.re':
        originalImageSrc = $('#image').attr('src');
        srcUrl = originalImageSrc;
        result = {
          name: 'yande.re',
          info: {
            type: 'image',
            srcUrl: srcUrl
          }
        };
    }
    return result;
  };
  $(document).on('click', '.kawpaa-save-link', function(e) {
    var params;
    e.preventDefault();
    params = getParamsToServer();
    return sendBackground(params);
  });
  return showKawpaaLink();
})();
