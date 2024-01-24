export type LoggerMethod = (...args: any[]) => void
export interface Logger {
  log: LoggerMethod
  warn: LoggerMethod
  error: LoggerMethod
  debug?: LoggerMethod
  info?: LoggerMethod
}

export type LoggerListener = (instance: LoggerInstance) => void
export type LoggerTypes = "log" | "warn" | "error" | "debug" | "info"
export interface LoggerInstance {
  type: LoggerTypes
  date: Date
  timestamp: string
  messages: any[]
  logger: Logger
}

export class LoggerInterceptor {
  private _allListeners = new Set<LoggerListener>()
  private _logListeners = new Set<LoggerListener>()
  private _warnListeners = new Set<LoggerListener>()
  private _errorListeners = new Set<LoggerListener>()
  private _debugListeners = new Set<LoggerListener>()

  private _log: LoggerMethod
  private _warn: LoggerMethod
  private _error: LoggerMethod
  private _debug?: LoggerMethod
  private _info?: LoggerMethod

  constructor(private readonly _logger: Logger) {
    this._log = this._logger.log.bind(this._logger)
    this._warn = this._logger.warn.bind(this._logger)
    this._error = this._logger.error.bind(this._logger)
    this._debug = this._logger.debug?.bind(this._logger)
    this._info = this._logger.info?.bind(this._logger)

    this._logger.log = this._createInterceptor(
      "log",
      this._log,
      this._logListeners
    )

    this._logger.warn = this._createInterceptor(
      "warn",
      this._warn,
      this._warnListeners
    )

    this._logger.error = this._createInterceptor(
      "error",
      this._error,
      this._errorListeners
    )

    if (this._debug) {
      this._logger.debug = this._createInterceptor(
        "debug",
        this._debug,
        this._debugListeners
      )
    }

    if (this._info) {
      this._logger.info = this._createInterceptor(
        "info",
        this._info,
        this._logListeners
      )
    }
  }

  private get _defaultLogger(): Logger {
    return {
      log: this._log,
      debug: this._debug,
      error: this._error,
      warn: this._warn,
      info: this._info,
    }
  }

  private _createInterceptor(
    type: LoggerTypes,
    method: LoggerMethod,
    listeners: Set<LoggerListener>
  ) {
    return (...messages: any[]) => {
      if (this._allListeners.size || listeners.size) {
        const date = new Date()
        const timestamp = date.toLocaleString()

        const instance = {
          date,
          type,
          timestamp,
          messages,
          logger: this._defaultLogger,
        }

        this._allListeners.forEach((fn) => fn(instance))
        listeners.forEach((fn) => fn(instance))
      }
      method(...messages)
    }
  }

  public on(callback: LoggerListener): void
  public on(type: LoggerTypes, callback: LoggerListener): void
  public on(type: LoggerTypes | LoggerListener, callback?: LoggerListener) {
    if (typeof type === "function") {
      this._allListeners.add(type)
      return () => {
        this._allListeners.delete(type)
      }
    }

    if (typeof callback !== "function") {
      return
    }

    if (type === "warn") {
      this._warnListeners.add(callback)
      return () => {
        this._warnListeners.delete(callback)
      }
    }

    if (type === "error") {
      this._errorListeners.add(callback)
      return () => {
        this._errorListeners.delete(callback)
      }
    }

    if (type === "debug") {
      this._debugListeners.add(callback)
      return () => {
        this._debugListeners.delete(callback)
      }
    }

    this._logListeners.add(callback)
    return () => {
      this._logListeners.delete(callback)
    }
  }

  public dispose(): void {
    this._logger.log = this._log
    this._logger.warn = this._warn
    this._logger.error = this._error
    this._logger.debug = this._debug
    this._logger.info = this._info

    this._allListeners.clear()
    this._logListeners.clear()
    this._warnListeners.clear()
    this._errorListeners.clear()
    this._debugListeners.clear()
  }
}
