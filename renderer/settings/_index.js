const { ipcRenderer } = window.api

ipcRenderer.on('ready', (e, data_) => {
  const { player, system } = data_

  Array.from(thema.options).find(opt => opt.value == player.thema).selected = true
  videoid.value = player.videoid
  volume.value = player.volume
  muted.checked = player.muted
  looped.checked = player.looped

  always.checked = system.always_top
})


const editable = document.getElementById('editable')
editable.addEventListener('change', e => {
  ipcRenderer.send('update/player-editable', e.target.checked)
})


const thema = document.getElementById('thema')
thema.addEventListener('change', e => {
  ipcRenderer.send('update/player-thema', e.target.value)
})

const videoid = document.getElementById('videoid')
videoid.addEventListener('input', e => {
  const reg = /https?:\/\/www.youtube.com\/watch\?v=([a-zA-Z0-9_-]+)/
  const [_, v] = e.target.value.match(reg) || []
  if (!v) return
  e.target.value = v
})

const apply = document.getElementById('apply')
apply.addEventListener('click', e => {
  ipcRenderer.send('update/player', videoid.value)
})

const volume = document.getElementById('volume')
volume.addEventListener('input', e => {
  ipcRenderer.send('update/player-volume', Number(e.target.value))
})

const muted = document.getElementById('muted')
muted.addEventListener('change', e => {
  ipcRenderer.send('update/player-muted', e.target.checked)
})

const looped = document.getElementById('looped')
looped.addEventListener('change', e => {
  ipcRenderer.send('update/player-looped', e.target.checked)
})


const always = document.getElementById('always-top')
always.addEventListener('change', e => {
  ipcRenderer.send('update/window-always-top', e.target.checked)
})
