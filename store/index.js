const Store = require('electron-store')
const schema = require('./schema.js')

const axios = require('axios')

class DataStore {
  constructor() {
    this.config_ = new Store({ schema })
  }

  get config() {
    return this.config_
  }

  async fetch(name, params) {
    let url

    switch (name) {
      case 'player':
        params.key = process.env.YOUTUBE_DATA_API_KEY

      case 'player':
        url = 'https://www.googleapis.com/youtube/v3/videos'
        break

      default:
        break
    }

    return await axios.get(url, { params })
  }
}

module.exports = new DataStore()
