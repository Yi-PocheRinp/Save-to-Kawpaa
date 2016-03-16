(function() {
  var DANBOORU_HOSTNAME, DATA_URL_BLUE_16, DEVIANTART_HOSTNAME, GELBOORU_HOSTNAME, KONACHAN_HOSTNAME, SANKAKUCOMPLEX_HOSTNAME, YANDE_RE_HOSTNAME, getHtmlToInsert, getParamsToServer, getSelectorInsertionTagetOfKawpaaLink, sendBackground, showKawpaaLink;
  SANKAKUCOMPLEX_HOSTNAME = 'chan.sankakucomplex.com';
  DANBOORU_HOSTNAME = 'danbooru.donmai.us';
  DEVIANTART_HOSTNAME = 'deviantart.com';
  GELBOORU_HOSTNAME = 'gelbooru.com';
  KONACHAN_HOSTNAME = 'konachan.com';
  YANDE_RE_HOSTNAME = 'yande.re';
  getSelectorInsertionTagetOfKawpaaLink = function() {
    var hostname, result;
    result = null;
    hostname = location.host;
    switch (hostname) {
      case SANKAKUCOMPLEX_HOSTNAME:
        result = '#share';
        break;
      case DANBOORU_HOSTNAME:
        result = '#post-sections';
        break;
      case GELBOORU_HOSTNAME:
      case KONACHAN_HOSTNAME:
      case YANDE_RE_HOSTNAME:
        result = '#right-col h4';
        break;
      default:
        if (hostname.indexOf(DEVIANTART_HOSTNAME) !== -1) {
          result = '.dev-meta-actions';
        }
    }
    return result;
  };
  getHtmlToInsert = function() {
    var hostname, result;
    result = null;
    hostname = location.host;
    switch (hostname) {
      case SANKAKUCOMPLEX_HOSTNAME:
        result = "<a class=\"kawpaa-save-link\" href=\"#\">Save to Kawpaa</a>";
        break;
      case DANBOORU_HOSTNAME:
        result = "<li><a class=\"kawpaa-save-link\" href=\"#\">Save to Kawpaa</a></li>";
        break;
      case GELBOORU_HOSTNAME:
      case KONACHAN_HOSTNAME:
      case YANDE_RE_HOSTNAME:
        result = " |\n<a class=\"kawpaa-save-link\" href=\"#\">Save to Kawpaa</a>";
        break;
      default:
        if (hostname.indexOf(DEVIANTART_HOSTNAME) !== -1) {
          result = "<a class=\"dev-page-button dev-page-button-with-text dev-page-download kawpaa-save-link\" href=\"#\" data-download_url=\"http://www.deviantart.com/download/460347620/gochiusa_by_azizkeybackspace-d7m2uhw.png?token=a6e80ce8b02c8c1dc7762417c29bf3d3b57bd13d&amp;ts=1458132778\">\n <i style=\"background: url(" + DATA_URL_BLUE_16 + "); background-position: none; background-repeat: no-repeat;\"></i>\n <span class=\"label\">Save to Kawpaa</span>\n</a>";
        }
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
    return new Promise(function(resolve, reject) {
      var hostname, originalImageSrc, result, sampleImgUrl, srcUrl;
      result = null;
      hostname = location.host;
      console.log(hostname);
      result = {
        info: {
          type: 'image'
        }
      };
      switch (hostname) {
        case SANKAKUCOMPLEX_HOSTNAME:
          $('#image').on('click', function(e) {
            var originalImageSrc, srcUrl;
            originalImageSrc = $('#image').attr('src');
            srcUrl = "https:" + originalImageSrc;
            result.name = SANKAKUCOMPLEX_HOSTNAME;
            result.info.srcUrl = srcUrl;
            return resolve(result);
          });
          $('#image').click();
          break;
        case DANBOORU_HOSTNAME:
          sampleImgUrl = $('#image').attr('src');
          originalImageSrc = sampleImgUrl.replace('sample/sample-', '');
          srcUrl = "https://danbooru.donmai.us" + originalImageSrc;
          result.name = DANBOORU_HOSTNAME;
          result.info.srcUrl = srcUrl;
          return resolve(result);
        case GELBOORU_HOSTNAME:
          originalImageSrc = $('#image').attr('src');
          srcUrl = originalImageSrc;
          result.name = GELBOORU_HOSTNAME;
          result.info.srcUrl = srcUrl;
          return resolve(result);
        case KONACHAN_HOSTNAME:
          originalImageSrc = $('#image').attr('src');
          srcUrl = originalImageSrc;
          result.name = KONACHAN_HOSTNAME;
          result.info.srcUrl = srcUrl;
          return resolve(result);
        case YANDE_RE_HOSTNAME:
          originalImageSrc = $('#image').attr('src');
          srcUrl = originalImageSrc;
          result.name = YANDE_RE_HOSTNAME;
          result.info.srcUrl = srcUrl;
          return resolve(result);
        default:
          if (hostname.indexOf(DEVIANTART_HOSTNAME) !== -1) {
            sampleImgUrl = $('.dev-content-full').attr('src');
            srcUrl = sampleImgUrl;
            result.name = DEVIANTART_HOSTNAME;
            result.info.srcUrl = srcUrl;
            return resolve(result);
          }
      }
    });
  };
  $(document).on('click', '.kawpaa-save-link', function(e) {
    e.preventDefault();
    return getParamsToServer().then(function(params) {
      return sendBackground(params);
    });
  });
  showKawpaaLink();
  return DATA_URL_BLUE_16 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wYYBzM05cEJigAABBtJREFUOBEBEATv+wEAAAAAAAAAAAAAAAAbescA5YY5ABt6xwQAAABOAAAAKAAAAAAAAADYAAAAseWGOf0bescA5YY5AAAAAAAAAAAAAQAAAAAAAAAAG3rHAAAAAAIAAACeAAAAXwAAALYAAADRAAAAAAAAAC8AAABKAAAAoAAAAGMAAAD+5YY5AAAAAAAEAAAAABt6xwAAAAAXAAAA4wAAAITlhjkBAAAAAAAAAAAAAAAAAAAAAAAAAAAbesd/AAAA+AAAABwbesfq5YY5AAEbescAAAAAAgAAAPgAAABE5YY5wgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbesc/AAAAuwAAAAgAAAD+AAAAAAAbesegG3rHfgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbesd/G3rHnwAAAAABG3rHBAAAAPvlhjkBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbesf/AAAABAIAAABOAAAAtgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALcAAABOAgAAACgAAADRAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0QAAACgCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAADYAAAALwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC8AAADYAgAAALIAAABKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASQAAALIAAAAAABt6x58besd+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABt6x4AbeseeAAAAAAEbescAAAAAAgAAAPgAAABE5YY5wgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbesc/AAAAuwAAAAcAAAD/AuWGOQAAAAD+AAAAHQAAALwbesd+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG3rHgAAAALsAAAAcAAAA/+WGOQABAAAAAAAAAAAbescAAAAAAgAAAJ0AAABgAAAAtgAAANEAAAAAAAAALwAAAEoAAACfAAAAYwAAAP/lhjkAAAAAAAIAAAAAAAAAAOWGOQAAAAD+5YY5YQAAAAQAAACdAAAA9AAAAPQAAACdAAAABOWGOWIAAAD/5YY5AAAAAAAAAAAA+yVtBA+LUxoAAAAASUVORK5CYII=";
})();
