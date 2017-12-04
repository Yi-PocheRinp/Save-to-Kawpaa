import $ from 'jquery';
import { targets } from '../../../config/config';
import KawpaaLinkInsertion from '../KawpaaLinkInsertion';

export default class IwaraKawpaaLinkInsertion extends KawpaaLinkInsertion {
  constructor() {
    super(targets.IWARA_HOSTNAME);
    this.selector = '.node-buttons';
    this.html = `
      <a id="kawpaa-save-button" href="#" target="_blank" class="btn btn-info kawpaa-save-link">
        <span class="glyphicon glyphicon-record"></span> Save to Kawpaa
      </a>`;
  }

  getType() {
    if (location.href.includes('iwara.tv/videos')) {
      return 'link';
    } else {
      return 'image';
    }
  }

  getContent() {
    if (location.href.includes('ecchi.iwara.tv/videos')) {
      var video = $('#video-player_html5_api');
      video.attr('controls', true);
      video.attr('width', '100%');
      return video.get(0).outerHTML;
    } else if (location.href.includes('www.iwara.tv/videos')) {
      var video = $('.embedded-video iframe');
      return video.get(0).outerHTML;
    } else {
      return null;
    }
  }

  getSrc() {
    return new Promise(resolve => {
      if (location.href.includes('ecchi.iwara.tv/videos')) {
        const videoThumbnailImage = $('#video-player').attr('poster');
        const srcUrl = `http:${videoThumbnailImage}`;
        return resolve(srcUrl);
      } else if (location.href.includes('www.iwara.tv/videos')) {
        const profileImage = $('.node-info .user-picture img').attr('src');
        const srcUrl = `http:${profileImage}`;
        return resolve(srcUrl);
      } else {
        return null;
      }
    });
  }

  getUrl() {
    return this.getSrc();
  }
}
