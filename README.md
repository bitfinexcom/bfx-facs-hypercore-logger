# bfx-facs-hypercore-logger

## Getting started
Install [Hypercore Logs](https://github.com/bitfinexcom/hypercore-logs)
```
npm install -g https://github.com/bitfinexcom/hypercore-logs.git
```

Reading from the public key can be started by
```
hyperlog read -k <public_key> --tail
```

## Config example
```jsonc
{
  "enable": true,
  "storageDir": "tmp/hypercore-logs", // stores hypercore files, including public and secret key
  "publicKey": "", // (optional) if empty, new key pair is created
  "secretKey": "", // (optional) if empty, new key pair is created,
  "feedOpts": {}, // (optional) feed options passed to Hypercore
  "swarmOpts": {} // (optional) swarm options passed to Hypercore
}
```

If `publicKey` and `secretKey` are empty, a new key pair is created and the public key is printed to stdout on start.


## Creating public/secret key
Creating your own set of public and secret key can be done by running:
```
$ hyperlog write -f dummy.txt
```

## Data storage
Hypercore requires a storage directory which can be configured in  `storageDir`.  
The directory holds:
- Public and secret key
- Logs

## API
Use `getLogger(opts)` to get a logger instance.  
Supported `opts` with their defaults:

```ts
{
  enableConsole: true // when enabled, prints logs to console
  enableHypercore: true // when enabled, sends logs to hypercore
}
```

Logger instance supports the following methods:

```js
logger.log(...params)
logger.info(...params) // same as logger.log()
logger.error(...params)
logger.trace(...params)
logger.warn(...params)
```
