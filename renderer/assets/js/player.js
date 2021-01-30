class Player {
  constructor(el) {
    this.el = el
    this.i = null
    this.data = {}
    this.request = null
    this.onReady = e => {}
    this.onPlaying = current => {}
  }

  ready(data) {
    this.data = data

    this.thema(data.thema)

    // 2. This code loads the IFrame Player API code asynchronously.
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  init() {
    this.i.destroy()
    cancelAnimationFrame(this.request)
  }

  apply() {
    this.volume(this.data.volume)
    this.mute(this.data.muted)
  }

  create(id = this.data.videoid) {
    this.i = new YT.Player('player', {
      height: '360',
      width: '640',
      videoId: id,
      events: {
        onReady: e => {
          this.apply()
          this.onReady({ ...e, data: this.data })
        },
        onStateChange: e => this._onStateChange(e)
      }
    })
  }

  _onStateChange(e) {
    switch(e.data) {
      case 0:
        if (!this.data.looped) return
        return this.play()

      default:
        return
    }
  }

  update(id) {
    this.data.videoid = id
    this.init()
    this.create(id)
  }

  thema(thema) {
    const modifier = v => `--thema-${v}`
    this.el.classList.remove(modifier(this.data.thema))
    this.data.thema = thema
    this.el.classList.add(modifier(thema))
  }

  edit(editable) {
    const modifier = '--editable'
    editable ? this.el.classList.add(modifier) : this.el.classList.remove(modifier)
  }

  fetch(id, part = 'snippet') {
    return ipcRenderer.invoke('fetch/player', { id, part })
  }

  play() {
    this.i.playVideo()
  }

  start(cb) {
    this.play()
    cb(this.playing.bind(this))
  }

  loop(looped) {
    this.data.looped = looped
  }

  toggle() {
    switch(this.i.getPlayerState()) {
      case 1:
      return this.i.pauseVideo()

      case -1:
      case 0:
      case 2:
      case 5:
      return this.play()

      default:
      return
    }
  }

  get duration() {
    return this.i.getDuration()
  }

  playing(cb) {
    const run = () => {
      cb(this.i.getCurrentTime())
      this.request = requestAnimationFrame(run)
    }
    requestAnimationFrame(run)
  }

  volume(volume) {
    this.data.volume = volume
    this.i.setVolume(volume)
  }

  mute(muted) {
    this.data.muted = muted
    muted ? this.i.mute() : this.i.unMute()
  }
}
