# pm2-windows-service

Allows easily installing and uninstalling [PM2](https://github.com/Unitech/PM2/) as a service on Windows machines - forked from [pm2-windows-service](https://github.com/jon-hall/pm2-windows-service).

```sh
  npm i @thebluesnevrdie/pm2-windows-service -g
```

## Installation

See original documentation at [pm2-windows-service](https://github.com/jon-hall/pm2-windows-service)

## Updates

* Merged the branch to fix Issue [#11](https://github.com/jon-hall/pm2-windows-service/issues/11) which adds the ability to supply the environment variables in a .pm2wsrc file.
* Added updates to modern versions of dependencies, which includes a fix for Issue [#51](https://github.com/jon-hall/pm2-windows-service/issues/51): Trying to install - Hangs after answering "Perform environment setup (recommended?"
