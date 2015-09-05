$ ->

  executeOnaItLaterScript = (infoStr) ->

    chrome.storage.sync.get ['token'], (item) ->

      if item.token is undefined or item.token is ''
        alert 'トークンが入力されていません。オプションページからトークンを入力してください'
        return

      # chrome.tabs.executeScript null, { file: 'build/js/vendors/lib.min.js' }, ->
      chrome.tabs.executeScript null, { file: 'bower_components/jquery/dist/jquery.min.js' }, ->
        chrome.tabs.executeScript null, { file: 'bower_components/alertify.js/lib/alertify.min.js' }, ->

          # chrome.tabs.insertCSS null, { file: 'build/css/vendors/lib.min.css' }, ->
          chrome.tabs.insertCSS null, { file: 'bower_components/alertify.js/themes/alertify.core.css' }, ->
            chrome.tabs.insertCSS null, { file: 'bower_components/alertify.js/themes/alertify.default.css' }, ->

              # 文字列で渡しても、content.jsではobjectとして受け取る。なので名前もinfo
              chrome.tabs.executeScript null, { code: "var info = #{infoStr};" }, ->

                chrome.tabs.executeScript null, { file: 'build/js/content.js' }, ->
                # chrome.tabs.executeScript null, { file: 'build/js/content.min.js' }, ->
                  console.log 'Script injected.'
                  return

  ###
  Browser Action
  ###
  # chrome.browserActionはbackgroundでしか動作しねーぞ
  chrome.browserAction.onClicked.addListener (tab) ->
    executeOnaItLaterScript(null)


  ###
  Context Menu
  ####
  clickHandler = (info, tab) ->
    console.log 'Context Menu =====> '
    console.log info
    infoStr = JSON.stringify info
    console.log infoStr
    executeOnaItLaterScript(infoStr)

  # TODO: videoも追加
  # chrome.contextMenus.create
  #   'title': 'Save to Kawpaa'
  #   'contexts': ['page', 'image', 'link']
  #   'id': 'image'

  contexts = [
    'page'
    # 'link'
    'image'
    # 'video'
  ]
  contexts.forEach (context) ->
    title = "Save to Kawpaa with #{context}"
    chrome.contextMenus.create
      'title': title
      'contexts': [ context ]
      'id': context


  chrome.contextMenus.onClicked.addListener(clickHandler)



  ###
  Icon
  ###
  chrome.runtime.onMessage.addListener (request, sender, sendResponse) ->
    chrome.browserAction.setIcon
      path: request.newIconPath
      tabId: sender.tab.id


  ###
  Shortcut Key
  ###
  chrome.commands.onCommand.addListener (command) ->
    console.log command
    executeOnaItLaterScript(null)