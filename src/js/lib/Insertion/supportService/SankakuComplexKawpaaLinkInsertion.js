import $ from 'jquery';
import { SUPPORT_SERVICE } from '../../../config/config';
import KawpaaLinkInsertion from '../KawpaaLinkInsertion';

export default class SankakuComplexKawpaaLinkInsertion extends KawpaaLinkInsertion {
  constructor() {
    super(SUPPORT_SERVICE.SANKAKUCOMPLEX_HOSTNAME);
    this.selector = '#share';
    this.html = `<a class="kawpaa-save-link" href="#">Save to Kawpaa</a>`;
  }

  getUrl() {
    return new Promise(resolve => {
      $('#image').on('click', function(e) {
        const originalImageSrc = $('#image').attr('src');
        const srcUrl = /^https?:\/\//.test(originalImageSrc)
          ? originalImageSrc
          : `https:${originalImageSrc}`;
        return resolve(srcUrl);
      });
      $('#image').click();
    });
  }
}
