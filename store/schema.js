module.exports = {
  additionalProperties: false,
  player: {
    type: 'object',
    additionalProperties: false,
    default: {
      thema: 'dark',
      videoid: '',
      volume: 50,
      muted: false,
      looped: false
    },
    properties: {
      thema: {
        type: 'string',
        enum: ['dark', 'transparent'],
        default: 'dark'
      },
      videoid: {
        type: 'string',
        default: ''
      },
      volume: {
        type: 'number',
        minimum: 0,
        maximum: 100,
        default: 50
      },
      muted: {
        type: 'boolean',
        default: false
      },
      looped: {
        type: 'boolean',
        default: false
      }
    }
  },
  system: {
    type: 'object',
    additionalProperties: false,
    default: {
      position: {},
      always_top: false
    },
    properties: {
      position: {
        type: 'object',
        properties: {
          x: {
            type: 'number'
          },
          y: {
            type: 'number'
          }
        }
      },
      always_top: {
        type: 'boolean',
        default: false
      }
    }
  }
}
