const { contextBridge, ipcRenderer } = require('electron')

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
      invoke: (channel, data) => {
        const channels = ['fetch/player']
        if (!channels.includes(channel)) return
        return ipcRenderer.invoke(channel, data)
      }
    }
  }
)
