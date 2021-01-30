const { ipcMain } = require('electron')
const store = require('../store')

class IpcRelay {
  constructor(window) {
    this.window = window
  }

  set to(window) {
    this.window = window
  }

  do(channel, key = "") {
    ipcMain.on(channel, (e, cond) => {
      if (key) store.config.set(key, cond)
      this.window.webContents.send(channel, cond)
    })
  }
}

module.exports = IpcRelay
