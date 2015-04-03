
var fs     = require('fs'),
    path   = require('path'),
    _      = require('underscore'),
    parseData  = require('./parse-data');

function Compressor()
{

};

Compressor.prototype = {

    compressFiles: function(filePath)
    {
        var filePaths = this.getFilePaths(__dirname+'/../../../' + filePath);
        fs.writeFileSync(filePaths.layoutbackupPath, fs.readFileSync(filePaths.layoutPath));
        fs.readFile(filePaths.layoutPath, {encoding: 'utf8'}, _.bind(this.onReadFile, this, filePaths ));
    },

    errorReadingFile: function(err)
    {
        throw err;
    },

    getFilePaths: function(filePath){
        return {
            layoutFolderPath: path.dirname(filePath),
            layoutPath: filePath,
            layoutbackupPath: filePath+'.save'
        };
    },

    onReadFile: function(filePaths, err, data)
    {
        err ?
            this.errorReadingFile(err) :
            parseData.run(filePaths, data, this.config);
    },

    run: function(config, env)
    {
        this.publicPath = path.dirname(config) + "/";
        this.tmpPath    = path.dirname(config) + "/";
        this.env        = env;

        fs.readFile(config, {encoding: 'utf8'}, _.bind(this.onReadConfig, this, config));
    },

    onReadConfig: function(configPath, err, data)
    {
        if (err) {
            this.errorReadingFile(err)
        }
        this.config = JSON.parse(data);
        this.config.env = this.env;

        this.setConfigPaths(configPath);

        _.each(this.config.layouts, _.bind(this.compressFiles, this));
    },

    setConfigPaths:function(configPath)
    {
        this.config.publicPath = path.dirname(configPath) +"/"+this.config.publicPath;
        this.config.tmpPath= path.dirname(configPath) +"/"+this.config.tmpPath;
    }
};

module.exports = new Compressor();