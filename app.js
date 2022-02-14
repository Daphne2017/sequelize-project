'use strict'

const path = require('path')

module.exports = app => {
  const directory = path.join(app.config.baseDir, 'utils')
  app.loader.loadToApp(directory, 'utils')
}
