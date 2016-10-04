
const fs          = require('fs')
const path        = require('path')
const parseData   = require('./parse-data')

function Compressor(options) {

    this.options = options
};

Compressor.prototype = {

    compressFiles: function(filePath)
    {
        var filePaths = this.getFilePaths(filePath);

        fs.writeFileSync(filePaths.layoutbackupPath, fs.readFileSync(filePaths.layoutPath));
        fs.readFile(filePaths.layoutPath, {encoding: 'utf8'}, this.onReadFile.bind(this, filePaths));
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
            parseData.run(filePaths, data, this.options);
    },

    run: function()
    {
        var layoutLength = this.options.layouts.length
        for (var i = 0; i < layoutLength; i++) {
            this.compressFiles(this.options.layouts[i])
        }
    }
};

module.exports = Compressor;