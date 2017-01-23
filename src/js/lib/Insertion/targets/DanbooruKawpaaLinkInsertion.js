const $ = require('jquery');
const {targets} = require('../../config');
const KawpaaLinkInsertion = require('../KawpaaLinkInsertion');

module.exports = class DanbooruKawpaaLinkInsertion extends KawpaaLinkInsertion {
  constructor() {
    super(targets.DANBOORU_HOSTNAME);
    this.selector = '#post-sections';
    this.html = `<li><a class="kawpaa-save-link" href="#">Save to Kawpaa</a></li>`;
  }

  getSrc() {
    return new Promise(resolve => {
      const imgUrl = $('#image-resize-link').attr('href') || $('#image').attr('src');
      const originalImageSrc = imgUrl.replace('sample/sample-', '');
      const url = `https://danbooru.donmai.us${originalImageSrc}`;
      return resolve(url);
    });
  }
}