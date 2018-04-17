var env = 'dev'
var buildEnv = (function () {
  switch (env) {
    case 'dev':
      return require('../config/dev.js')
    case 'prod':
      return require('../config/prod.js')
    case 'sandbox':
      return require('../config/sandbox.js')
    default:
      return require('../config/prod.js')
  }
})()
module.exports = buildEnv