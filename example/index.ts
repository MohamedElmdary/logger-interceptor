import { LoggerInterceptor } from "../lib"

const customLogger = {
  log: console.log.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
}

const interceptorConsole = new LoggerInterceptor(console)

interceptorConsole.on(({ logger, ...instance }) => {
  logger.log(JSON.stringify(instance))
})

console.log("test log")
console.info("test info")
console.error("test error")
console.warn("test warn")
console.table("test table")
console.debug("test debug")

interceptorConsole.dispose()

console.log("should be unwrapped test log")

const interceptorMyLogger = new LoggerInterceptor(customLogger)

interceptorMyLogger.on((i) => {
  console.log({ instance: i })
})

customLogger.log("hello world")
