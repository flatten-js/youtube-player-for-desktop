const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })

const electron = require('electron')
const { app, BrowserWindow, ipcMain, Menu, MenuItem } = electron

const store = require('./store')

const ipcRelay = new (require('./lib/ipc-relay.js'))()

const WindowManager = require('./lib/wm.js')
const wm = new WindowManager({ path: path.join(__dirname, 'renderer') })

const menu = new Menu()

menu.append(new MenuItem({
  label: '設定を開く',
  click: () => {
    if (wm.settings) return wm.settings.show()

    wm.register('settings', {
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: true,
        preload: path.join(__dirname, "preload.js")
      }
    })
    wm.load('settings', 'settings/index.html')

    wm.settings.webContents.on('did-finish-load', () => {
      wm.settings.webContents.send('ready', store.config.store)
    })

    // wm.devTools('settings')
  }
}))

menu.append(new MenuItem({
  label: '終了',
  click: () => {
    const [x, y] = wm.main.getPosition()
    store.config.set('system.position', { x, y })
    app.quit()
  }
}))

app.on('ready', () => {
  wm.register('main', {
    ...store.config.get('system.position'),
    height: 119,
    transparent: true,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, "preload.js")
    }
  })
  wm.load('main', 'player/index.html')

  wm.main.webContents.on('did-finish-load', () => {
    wm.main.setAlwaysOnTop(store.config.get('system.always_top'))
    wm.main.webContents.send('ready', { ...store.config.get('player') })
  })

  ipcRelay.to = wm.main

  // wm.devTools('main')
})

ipcMain.on('open/context-menu', () => menu.popup())

ipcMain.handle('fetch/player', async (e, params) => {
  return (await store.fetch('player', params)).data
})

ipcRelay.do('update/player-thema', 'player.thema')
ipcRelay.do('update/player', 'player.videoid')
ipcRelay.do('update/player-volume', 'player.volume')
ipcRelay.do('update/player-muted', 'player.muted')
ipcRelay.do('update/player-looped', 'player.looped')

ipcRelay.do('update/player-editable')

ipcMain.on('update/window-always-top', (e, cond) => {
  store.set('system.always_top', cond)
  wm.main.setAlwaysOnTop(cond)
})
