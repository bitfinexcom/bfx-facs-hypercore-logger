class Logger {
  constructor (opts = {}) {
    this.server = opts.hypercoreServer

    const defaultOpts = {
      enableConsole: true,
      enableHypercore: true
    }

    this.opts = {
      ...defaultOpts,
      ...opts
    }
  }

  log (...params) {
    const line = this._formatMessage(params)
    this._logHypercore(line)

    if (this.opts.enableConsole) {
      console.log(line)
    }
  }

  info (...params) {
    return this.log(...params)
  }

  error (...params) {
    const line = this._formatMessage(params, true)
    this._logHypercore(line)

    if (this.opts.enableConsole) {
      console.error(line)
    }
  }

  trace (...params) {
    const line = this._formatMessage(params, true)
    const msg = `${line}\n${(new Error()).stack}`

    this._logHypercore(msg)

    if (this.opts.enableConsole) {
      console.error(msg)
    }
  }

  warn (...params) {
    const line = this._formatMessage(params, true)
    this._logHypercore(line)

    if (this.opts.enableConsole) {
      console.warn(line)
    }
  }

  _getTimestamp () {
    return new Date().toISOString()
  }

  _formatMessage (params, includeStack = false) {
    const line = []
    line.push(this._getTimestamp())

    const msgParts = params.map(p => {
      if (includeStack && p instanceof Error && p.stack) {
        return p.stack
      }

      return p
    })
    line.push(...msgParts)

    return line.join(' ')
  }

  _getStack (params) {
    const stack = params.map(p => {
      if (p instanceof Error && p.stack) {
        return p.stack
      }

      return null
    }).filter(Boolean)

    return stack.join('\n')
  }

  _logHypercore (msg) {
    if (this.opts.enableHypercore && this.server) {
      this.server.feed.append(msg)
    }
  }
}

module.exports = Logger
