
const path      = require('path')
const fs        = require('fs')
const evento    = require('evento')
const os        = require('os')
const messages  = require('./messages')


/**
 * @param {string} filePath
 * @returns {string}
 */
function normalizeFrom(basePath, filePath) {

    return path.isAbsolute(filePath) ?
        path.normalize(filePath) :
        path.join(basePath, filePath)
}

/**
 * @param {string} path
 * @returns {boolean}
 */
function isPathInvalid(path) {

    return isValueInvalid(path) ||
        !fs.statSync(path).isFile()
}

/**
 * @param {string} value
 * @returns {boolean}
 */
function isValueInvalid(value) {

    return value === undefined ||
        value.length === undefined ||
        value.length < 1
}

/**
 * @param {string} pathToConfig
 * @param {boolean} env
 * @constructor
 */
var Options = function(pathToConfig, env) {

    if (isPathInvalid(pathToConfig)) {
        evento.trigger(messages.informerError, 'Path to config file is not valid!')
        evento.trigger(messages.commanderHelp)
        process.exit()
    }

    if (isValueInvalid(env)) {
        evento.trigger(messages.informerError, 'Env value is required!')
        evento.trigger(messages.commanderHelp)
        process.exit()
    }

    evento.trigger(messages.informerLoading, 'Reading config')
    var configPath      = normalizeFrom(process.cwd(), pathToConfig)
    var configDirName   = path.dirname(configPath)
    var rawData         = fs.readFileSync(configPath, 'utf8');
    var data            = JSON.parse(rawData)
    evento.trigger(messages.informerSuccess, 'Config loaded from: ' + configPath)

    evento.trigger(messages.informerInfo, 'Env: ' + env)

    this.layouts = data.layouts.map(function(oneLayout) { return normalizeFrom(configDirName, oneLayout) } );
    evento.trigger(messages.informerInfo, 'Layouts: ' + os.EOL + '    ' + this.layouts.join(os.EOL + '    '))

    this.publicPath = normalizeFrom(configDirName, data.publicPath)
    evento.trigger(messages.informerInfo, 'Public path: ' + this.publicPath)

    this.tmpPath                = normalizeFrom(configDirName, data.tmpPath)
    evento.trigger(messages.informerInfo, 'Tmp path: ' + this.tmpPath)

    this.compressedFilePrefix   = data.compressedFilePrefix[env]
    evento.trigger(messages.informerInfo, 'Compressed file prefix: ' + this.compressedFilePrefix)
}

Options.prototype = {}

module.exports = Options