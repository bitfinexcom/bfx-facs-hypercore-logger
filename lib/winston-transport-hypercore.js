const { HyperCoreLogger } = require('hypercore-logs')
const Transport = require('winston-transport')

module.exports = class HyperCoreTransport extends Transport {
  constructor (opts = {}) {
    super(opts)

    if (!opts.server || !(opts.server instanceof HyperCoreLogger)) {
      throw new Error('opts.server is required')
    }

    this.server = opts.server
  }

  log (info, callback) {
    setImmediate(() => this.emit('logged', info))
    this.server.feed.append(info[Symbol.for('message')], callback)
  }
}
