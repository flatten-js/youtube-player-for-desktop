const path = require('path')
const { BrowserWindow } = require('electron')

class WindowManager {
  constructor(options = {}) {
    this.path = options.path
  }

  register(name, options, menu = null) {
    let win = this[name] = new BrowserWindow(options)
    win.setMenu(menu)
    win.on('closed', () => this[name] = null)
  }

  load(name, p) {
    this[name].loadURL(path.join(this.path, p))
  }

  devTools(name) {
    this[name].webContents.openDevTools()
  }
}

module.exports = WindowManager
