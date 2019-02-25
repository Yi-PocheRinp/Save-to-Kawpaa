import $ from 'jquery';
import { SUPPORT_SERVICE, ICONS } from '../../../../config/';
import KawpaaButtonInsertion from '../KawpaaButtonInsertion';

export default class TwitterKawpaaButtonInsertion extends KawpaaButtonInsertion {
  constructor() {
    super(SUPPORT_SERVICE.TWITTER_HOSTNAME);
    this.container = '.permalink-tweet-container';
    this.stream_tweet = '.js-stream-tweet';
    this.tweet_container = '.permalink-tweet';
    this.tweet_url = '.tweet-timestamp';
    this.twitter_fullname = '.fullname'; // ぴゃー
    this.twitter_username = '.username'; // @puaa
    this.tweet_text = '.js-tweet-text';
    this.tweet_image = '.js-adaptive-photo';
    this.tweet_media = '.media-image';
    this.kawpaa_button_container = '.action-kawpaa-container';
    this.kawpaa_button = '.ProfileTweet-actionList';
    this.twitter_movie = 'video > source';
  }

  getTweetType(element) {
    const hasPhoto = element.find(this.tweet_image).length > 0;
    const hasMovie = element.find(this.twitter_movie).length > 0;

    if (hasPhoto) {
      return 'photo';
    }
    if (hasMovie) {
      return 'movie';
    }
    return 'text';
  }

  getInfo(targetElement) {
    return new Promise(resolve => {
      let tweetUrl =
        targetElement.find(this.tweet_url).attr('href') ||
        targetElement.find(this.tweet_container).data('permalink-path');
      let fullname = targetElement.find(this.twitter_fullname).text();
      let username = targetElement.find(this.twitter_username).text();
      let monoUsername = /^@(\w)*/.exec(username)[0]; // ツイート詳細モーダルだと複数の@usernameが取得されるので単一にする。
      let text = targetElement.find(this.tweet_text).text();
      let title = `${fullname} ${monoUsername} / ${text}`;

      const tweetType = this.getTweetType(targetElement);
      const info = (tweetType => {
        switch (tweetType) {
          case 'photo': {
            let imageUrl = targetElement
              .find(this.tweet_image)
              .attr('data-image-url');
            // 複数枚のときは今見ている画像を保存する。
            imageUrl =
              $(this.tweet_media)
                .first()
                .attr('src') || imageUrl;
            imageUrl = imageUrl.replace(':large', '');

            const info = {
              siteUrl: `https://twitter.com${tweetUrl}`,
              title: title,
              srcUrl: `${imageUrl}:orig`,
            };
            return info;
          }
          case 'movie': {
            let imageUrl = targetElement.find(this.twitter_movie).attr('src'); // 動画(mp4)
            // 複数枚のときは今見ている画像を保存する。
            // console.log(imageUrl);
            // imageUrl =
            //   $(this.tweet_media)
            //     .first()
            //     .attr('src') || imageUrl;
            // console.log(imageUrl);

            const info = {
              siteUrl: `https://twitter.com${tweetUrl}`,
              title: title,
              srcUrl: `${imageUrl}`,
            };
            return info;
          }
        }
      })(tweetType);

      return resolve(info);
    });
  }

  show(_$) {
    const existKawpaaButton =
      _$.find(this.kawpaa_button_container).length !== 0;
    const hasPhoto = _$.find(this.tweet_image).length > 0;
    const hasMovie = _$.find(this.twitter_movie).length > 0;
    if (existKawpaaButton || !(hasPhoto || hasMovie)) {
      return;
    }

    const html = `\
      <div class="ProfileTweet-action action-kawpaa-container" style="display: inline-block; min-width:80px;">
        <a class="${
          this.kawpaaLinkClassName
        } js-tooltip" href="#" data-original-title="Save to Kawpaa" style="display: inline-block; float: left;">
          <span class="icon icon-kawpaa" style="display: block; height: 16px; position: relative; top: 3px; width: 16px; background-image: url(${
            ICONS.GRAY_16
          });">a</span>
        </a>
      </div>\
    `;
    return _$.find('.ProfileTweet-action--dm').after(html);
  }

  onClick() {
    const _this = this;
    $(document).on('click', this.onClickElement, function(e) {
      e.preventDefault();

      // 画像の差し替え
      $(this)
        .find('.icon-kawpaa')
        .css('background-image', 'url(' + ICONS.BLUE_16 + ')');

      const $jsStreamTweet = $(this).closest(_this.stream_tweet);
      const $permalinkTweetContaner = $(this).closest(_this.tweet_container);
      const nowPageVariable =
        $jsStreamTweet.length > 0 ? 'homeTImeline' : void 0;
      var targetElement = null;
      switch (nowPageVariable) {
        case 'homeTImeline':
          targetElement = $jsStreamTweet;
          break;
        default:
          targetElement = $permalinkTweetContaner;
      }

      _this
        .getInfo(targetElement)
        .then(info => _this.getParamsToServer(info))
        .then(params => _this.send(params));
    });
  }

  onMouseEnter() {
    const _this = this;
    $(document).on(
      {
        mouseenter: function(e) {
          _this.show($(this));
        },
      },
      _this.container,
    );

    $(document).on(
      {
        mouseenter: function(e) {
          _this.show($(this));
        },
      },
      _this.stream_tweet,
    );
  }
}
