const Base = require('bfx-facs-base')
const { HyperCoreLogger } = require('hypercore-logs')
const path = require('path')
const Logger = require('./lib/logger')

class HyperCoreLoggerFacility extends Base {
  loggerInstance

  constructor (caller, opts, ctx) {
    super(caller, opts, ctx)

    this.name = 'hypercore-logger'
    this._hasConf = true

    this.init()
  }

  _start0 (cb) {
    const hypercoreCfg = this.conf
    if (!hypercoreCfg?.enable) {
      return cb(null)
    }

    const feedDir = path.normalize(path.resolve(hypercoreCfg.storageDir))
    const server = new HyperCoreLogger(
      feedDir,
      hypercoreCfg.publicKey,
      {
        secretKey: hypercoreCfg.secretKey,
        ...(hypercoreCfg.feedOpts ?? {})
      },
      hypercoreCfg.swarmOpts ?? {}
    )

    this.hyperCoreLogs = server

    server.start()
      .then(() => {
        if (!hypercoreCfg.publicKey) {
          console.log(`HyperCore public key: ${server.feed.key.toString('hex')}`)
        }

        cb(null)
      })
      .catch(err => cb(err))
  }

  getLogger () {
    if (!this.loggerInstance) {
      this.loggerInstance = this.createLogger()
    }

    return this.loggerInstance
  }

  createLogger (opts = {}) {
    const hypercoreCfg = this.conf

    const logger = new Logger({
      ...opts,
      hypercoreServer: this.hyperCoreLogs,
      enableHypercore: hypercoreCfg.enable
    })

    return logger
  }
}

module.exports = HyperCoreLoggerFacility
