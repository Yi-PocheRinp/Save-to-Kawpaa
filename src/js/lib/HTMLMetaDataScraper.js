const $ = require('jquery');

module.exports = class HTMLMetaDataScraper {
  constructor(data) {
    this.data = data;
  }

  __guard__(value, transform) {
    return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
  }

  removeHrefInATag(html) {
    let TAG_REGEX = /(href=".*?")/gi;
    return html.replace(TAG_REGEX, '');
  }

  removeTag(tagName, html) {
    let TAG_REGEX = new RegExp(`<${tagName}\\b[^<]*(?:(?!<\\/${tagName}>)<[^<]*)*<\\/${tagName}>`, 'gi');
    while (TAG_REGEX.test(html)) {
      html = html.replace(TAG_REGEX, "");
    }
    return html;
  }

  // あとで消す？
  removeScriptTag(html) {
    let SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    while (SCRIPT_REGEX.test(html)) {
      html = html.replace(SCRIPT_REGEX, "");
    }
    return html;
  }

  searchIframeSrc() {
    return this.__guard__($('iframe'), x => x.src);
  }

  // getIframe

  /*
  linkなら本文や、動画の埋め込みリンク
  imageならnull
  */
  getContent() {

    if (this.getType() === 'image') { return null; }

    let content = null;

    // youtube
    if (location.href.indexOf("www.youtube.com/watch?v=") > -1) {
      let vNumber = location.search.split('&').shift().split('=').pop();
      console.log('vNumber = ', vNumber);
      content = `\
<iframe width="560" height="315" src="https://www.youtube.com/embed/${vNumber}" frameborder="0" allowfullscreen></iframe>\
`;

    // ニコニコなら動画のサムネを指定
    // # ニコニコはhttpsに対応していないのでiframeがブロックされます。どうしようもないので待ちましょう。
    } else if (location.href.indexOf("www.nicovideo.jp/watch/sm") > -1) {
      let { title } = document;
      let smNumber =  location.href.split('/').pop();
      console.log('title = ', title);
      console.log('smNumber = ', smNumber);
      content = `\
<iframe width="312" height="176" src="//ext.nicovideo.jp/thumb/${smNumber}" scrolling="no" style="border:solid 1px #CCC;" frameborder="0"><a href="//www.nicovideo.jp/watch/${smNumber}">${title}</a></iframe>\
`;

    // 2ch
    } else if ((location.href.indexOf("bbspink.com") > -1) || (location.href.indexOf("2ch.net") > -1)) {
      content = this.removeScriptTag($('.thread').html());

    // ふたば
    } else if (location.href.indexOf("2chan.net") > -1) {
      content = this.removeScriptTag($('.thre').html());

    // Just for me
    } else if (location.href.indexOf("mannanoeroetaiken.blog.fc2.com") > -1) {
      content = this.removeTag('img', this.removeTag('iframe', this.removeHrefInATag(this.removeScriptTag($('.content').html()))));

    } else {
      // iframe_src = @searchIframeSrc()
      // if iframe_src

      content = this.removeScriptTag($('section').html());
      console.log(content);
    }

    return content;
  }


  getTitle() {
    let t1 = $('head title').text();
    let t2 = $('meta[property="og:title"]').attr('content');
    return t1 || t2;
  }

  getSiteName() {
    let sn = $('meta[property="og:site_name"').text();
    return sn;
  }

  getSiteURL() {
    let su1 = $(location).attr('href');
    let su2 = $('meta[property="og:url"]').attr('content');
    return su1 || su2;
  }

  getSiteImage() {
    let si = $('meta[property="og:image"]').attr('content');
    return si;
  }

  getHostName() {
    let hn = location.host;
    return hn;
  }

  getType() {
    let isImage = (this.__guard__(this.data, x => x.type) === 'image') || ((this.__guard__(this.data, x1 => x1.mediaType) != null) && (this.__guard__(this.data, x2 => x2.menuItemId) === 'image'));
    let t = isImage ? 'image' : 'link';
    return t;
  }

  getURL() {
    let u;
    if (this.getType() === 'image') { return this.data.srcUrl; }

    let siteURL = this.getSiteURL();

    // デフォ値の設定
    let $img = $('img');
    let DEFUALT_URL = 'https://36.media.tumblr.com/9086462174c34becaf8b3e59de8f5800/tumblr_nzek2kWNNJ1ukgdjoo2_1280.jpg';

    if (($img != null) && ($img.length > 0)) { // bodyタグ内で一番最初の画像を引っ張ってくる
      console.log('画像ファイル発見', $img);
      let firstImgUrlInBody = $img.get(0).src;
      // 存在しないなら初期値を設定する
      // (ex) Twitterだと、"$img.get(0) = <img class=​"avatar size32" alt>​"とかになる。srcがねえ。
      u = firstImgUrlInBody || DEFUALT_URL;
    } else { // ページに画像が存在しない場合は灰色の画像を代わりに使用
      console.log('画像ファイルが見つからない。');
      u = DEFUALT_URL;
    }

    /*
    ここから例外処理(特別処理？)
    */
    // 例外中の例外。もし、他のChromeExtensionがimgを挿入していた場合、urlにchrome-extension://から始まる画像ファイルが代入され、保存に失敗してしまう。
    if (this.__guard__(this.__guard__(this.data, x1 => x1.url), x => x.indexOf("chrome-extension://")) > -1) {
      console.log('ChromeExnteionsファイルを画像に設定されてしまった。');
      u =  $img.get(1).src;
    }

    // ニコニコなら動画のサムネを指定
    if (siteURL.indexOf("www.nicovideo.jp/watch/sm") > -1) {
      u = $('.videoThumbnailImage').attr('src');
    }

    // youtube
    // TODO: 別の動画に移動しても$('meta[property="og:image"]').attr('content')に変化なし。分からん。
    if (siteURL.indexOf("www.youtube.com/watch?v=") > -1) {
      u = this.__guard__($('meta[property="og:image"]'), x2 => x2.attr('content'));
    }

    // XVIDEOSなら動画のサムネを指定
    if (siteURL.indexOf("xvideos.com/video") > -1) {
      u = $('img.thumb').attr('src');
    }


    return u;
  }

  getSiteDescription() {
    let d1 = $('meta[name="description"]').attr('content');
    let d2 = $('meta[property="og:description"]').attr('content');
    return d1 || d2;
  }

  getFavicon() {
    let f = $('link[rel="shortcut icon"]').prop('href');
    return f;
  }

  scrape() {
    return {
      content: this.getContent(),
      title: this.getTitle(),
      siteName: this.getSiteName(),
      siteUrl: this.getSiteURL(),
      type: this.getType(),
      url: this.getURL(),
      hostName: this.getHostName(),
      description: this.getSiteDescription(),
      siteImage: this.getSiteImage(),
      favicon: this.getFavicon()
    };
  }
}
