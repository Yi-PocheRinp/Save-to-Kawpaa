import ChromeExecuter from './utils/ChromeExecuter';
import ChromeSyncStorageManager from './utils/ChromeSyncStorageManager';

export default class KawpaaScriptExecuter {
  constructor(info) {
    this.tasks = [
      ChromeExecuter.insertCSS({ file: `build/css/vendors/lib.css` }),
      ChromeExecuter.executeScript({ code: `var info = ${info};` }),
    ];
    return this;
  }

  execute() {
    Promise.all(this.tasks).then(results => {
      const task = { file: 'build/js/contents.bundle.js' };
      ChromeExecuter.executeScript(task).then(result =>
        console.log('script injected'),
      );
    });
  }
}
