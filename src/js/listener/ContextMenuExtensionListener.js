import KawpaaScriptExecuter from '../lib/KawpaaScriptExecuter';

export default class ContextMenuExtensionListener {
  constructor() {
    this.contexts = ['page', 'image', 'selection'];
    this.create();
    return this;
  }

  activate() {
    chrome.contextMenus.onClicked.addListener(this.onClick);
  }

  create() {
    this.contexts.forEach(context => {
      const title = `Save to Kawpaa with ${context}`;
      chrome.contextMenus.create({
        title: title,
        contexts: [context],
        id: context,
      });
    });

    chrome.contextMenus.create({
      title: 'Open Kawpaa',
      contexts: ['browser_action'],
      id: 'browser_action_open_kawpaa',
    });
  }

  onClick(info, tab) {
    if (info.menuItemId === 'browser_action_open_kawpaa') {
      const KAWPAA_URL = 'https://kawpaa.eiurur.xyz/';
      chrome.tabs.create({ url: KAWPAA_URL, active: true }, tab =>
        console.log('open Kawpaa'),
      );
      return;
    }
    console.log(tab);
    console.log(info);
    let infoStr = JSON.stringify(info);
    new KawpaaScriptExecuter(infoStr).execute();
  }
}
