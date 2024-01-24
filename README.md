# Logger Interceptor

### Install

```bash
npm i logger-interceptor
```

### Examples

- With console

```ts
const interceptor = new LoggerInterceptor(console)

interceptor.on(({ logger, ...instance }) => {
  logger.log(JSON.stringify(instance))
})

console.log("test log")
console.info("test info")
console.error("test error")
console.warn("test warn")
console.table("test table")
console.debug("test debug")

// logs
/*
{"date":"2024-01-24T10:34:23.244Z","type":"log","timestamp":"1/24/2024, 12:34:23 PM","messages":["test log"]}
test log
{"date":"2024-01-24T10:34:23.260Z","type":"info","timestamp":"1/24/2024, 12:34:23 PM","messages":["test info"]}
test info
{"date":"2024-01-24T10:34:23.260Z","type":"error","timestamp":"1/24/2024, 12:34:23 PM","messages":["test error"]}
test error
{"date":"2024-01-24T10:34:23.261Z","type":"warn","timestamp":"1/24/2024, 12:34:23 PM","messages":["test warn"]}
test warn
{"date":"2024-01-24T10:34:23.261Z","type":"log","timestamp":"1/24/2024, 12:34:23 PM","messages":["test table"]}
test table
{"date":"2024-01-24T10:34:23.261Z","type":"debug","timestamp":"1/24/2024, 12:34:23 PM","messages":["test debug"]}
test debug
*/
```

- With Custom Logger

```ts
const customLogger = {
  log: console.log.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
}
const interceptor = new LoggerInterceptor(customLogger)

interceptor.on(({ logger, ...instance }) => {
  logger.log(JSON.stringify(instance))
})

customLogger.log("test log")
customLogger.info("test info")
customLogger.error("test error")
customLogger.warn("test warn")
customLogger.table("test table")
customLogger.debug("test debug")

// logs
/*
{"date":"2024-01-24T10:37:43.564Z","type":"log","timestamp":"1/24/2024, 12:37:43 PM","messages":["test log"]}
test log
{"date":"2024-01-24T10:37:43.578Z","type":"error","timestamp":"1/24/2024, 12:37:43 PM","messages":["test error"]}
test error
{"date":"2024-01-24T10:37:43.578Z","type":"warn","timestamp":"1/24/2024, 12:37:43 PM","messages":["test warn"]}
test warn
*/
```
