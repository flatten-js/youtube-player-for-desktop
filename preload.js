const { contextBridge, ipcRenderer } = require('electron')
const { ssToHms } = require('./lib/utils.js')

const share_channels = [
  'update/player-thema',
  'update/player',
  'update/player-volume',
  'update/player-muted',
  'update/player-looped',
  'update/player-editable'
]

contextBridge.exposeInMainWorld(
  "api", {
    ipcRenderer: {
      send: (channel, data) => {
        const channels = [...share_channels, 'open/context-menu', 'update/window-always-top']
        if (!channels.includes(channel)) return
        ipcRenderer.send(channel, data)
      },
      on: (channel, handler) => {
        const channels = [...share_channels, 'ready']
        if (!channels.includes(channel)) return
        ipcRenderer.on(channel, handler)
      },
    },
    key: process.env.YOUTUBE_DATA_API_KEY,
    utils: { ssToHms }
  }
)
