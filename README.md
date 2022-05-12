# bfx-facs-hypercore-logger

## Getting started
Install [Hypercore CLI](https://hypercore-protocol.org/) and [Hypercore Logs](https://github.com/bitfinexcom/hypercore-logs)
```
npm install -g @hyperspace/cli 
npm install -g https://github.com/bitfinexcom/hypercore-logs.git
```

Run Hypercore daemon
```
hyp daemon start
```

Reading from the public key can be started by
```
hyperlog read -k <public_key> --tail
```

## Config example
```
{
  "enable": true,
  "level": "info", // log level to be sent to Hypercore logs
  "storageDir": "tmp/hypercore-logs", // stores hypercore files, including public and secret key
  "publicKey": "", // (optional) if empty, new key pair is created
  "secretKey": "" // (optional) if empty, new key pair is created
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
Use `getLogger()` to get a logger instance.  
The logger is an instance of Winston with `console` and `hypercore` transports configured.

Refer to [Winston Docs](https://github.com/winstonjs/winston#readme) for more information on the Winston API.
