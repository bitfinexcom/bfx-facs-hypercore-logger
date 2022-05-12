const Base = require('bfx-facs-base')
const { HyperCoreLogger } = require('hypercore-logs')
const HyperCoreTransport = require('./lib/winston-transport-hypercore')
const path = require('path')
const winston = require('winston')

class HyperCoreLoggerFacility extends Base {
  constructor (caller, opts, ctx) {
    super(caller, opts, ctx)

    this.name = 'hypercore-logger'
    this._hasConf = true

    this.init()
  }

  _start0 (cb) {
    super._start0(err => {
      if (err) {
        return cb(err)
      }

      const hypercoreCfg = this.conf
      if (!hypercoreCfg?.enable) {
        return cb(null)
      }

      const feedDir = path.join(process.cwd(), hypercoreCfg.storageDir)
      const server = new HyperCoreLogger(
        feedDir,
        hypercoreCfg.publicKey,
        {
          secretKey: hypercoreCfg.secretKey
        }
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
    })
  }

  getLogger () {
    const { format } = winston
    const hypercoreCfg = this.conf

    const logger = winston.createLogger({
      level: 'info',
      format: format.combine(
        format.errors({ stack: true }),
        format.timestamp(),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}${info.stack ? `\n${info.stack}` : ''}`)
      ),
      transports: [
        new winston.transports.Console()
      ]
    })

    if (hypercoreCfg.enable) {
      const hypercore = new HyperCoreTransport({
        server: this.hyperCoreLogs,
        level: hypercoreCfg.level ?? 'info'
      })

      logger.add(hypercore)
    }

    logger.on('error', err => {
      console.trace(err)
    })

    return logger
  }
}

module.exports = HyperCoreLoggerFacility
