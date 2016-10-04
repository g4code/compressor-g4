
const path      = require('path')
const fs        = require('fs')
const evento    = require('evento')


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
        evento.trigger('INFORMER|ERROR', 'Path to config file is not valid!')
        evento.trigger('COMMANDER|HELP')
        process.exit()
    }

    if (isValueInvalid(env)) {
        evento.trigger('INFORMER|ERROR', 'Env value is required!')
        evento.trigger('COMMANDER|HELP')
        process.exit()
    }

    var configPath      = normalizeFrom(process.cwd(), pathToConfig)
    var configDirName   = path.dirname(configPath)
    var rawData         = fs.readFileSync(configPath, 'utf8');
    var data            = JSON.parse(rawData)

    this.layouts                = data.layouts.map(function(oneLayout) { return normalizeFrom(configDirName, oneLayout) } );
    this.publicPath             = normalizeFrom(configDirName, data.publicPath)
    this.tmpPath                = normalizeFrom(configDirName, data.tmpPath)
    this.compressedFilePrefix   = data.compressedFilePrefix[env]
}

Options.prototype = {}

module.exports = Options