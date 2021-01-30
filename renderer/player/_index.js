const { ipcRenderer, key, utils } = window.api
const player = new Player(document.getElementById('main'), key)

window.addEventListener('contextmenu', e => {
  e.preventDefault()
  ipcRenderer.send('open/context-menu')
})

function onYouTubeIframeAPIReady() {
  player.create()
}

player.onReady = async e => {
  const data = await player.fetch(e.data.videoid)
  const video = data.items[0]

  if(!video) return

  const bar = document.getElementById('bar')
  const now = document.getElementById('now')
  const max = document.getElementById('max')

  const duration = player.duration
  max.innerHTML = utils.ssToHms(duration)

  const title = document.getElementById('title')
  title.innerHTML = video.snippet.title

  player.start(playing => {
    window.addEventListener('click', e => player.toggle())

    playing(current => {
      now.innerHTML = utils.ssToHms(current)
      bar.style.width = (current / duration * 100) + "%"
    })
  })
}

ipcRenderer.on('ready', (e, data_) => {
  player.ready(data_)
})


ipcRenderer.on('update/player-editable', (e, editable) => {
  player.edit(editable)
})


ipcRenderer.on('update/player-thema', (e, thema) => {
  player.thema(thema)
})

ipcRenderer.on('update/player', (e, videoid) => {
  player.update(videoid)
})

ipcRenderer.on('update/player-volume', (e, volume) => {
  player.volume(volume)
})

ipcRenderer.on('update/player-muted', (e, muted) => {
  player.mute(muted)
})

ipcRenderer.on('update/player-looped', (e, looped) => {
  player.loop(looped)
})
