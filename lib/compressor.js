
const fs            = require('fs')
const path          = require('path')
const evento        = require('evento')
const messages      = require('./messages')
const ParseData     = require('./parse-data')

function Compressor(options) {

    this.options = options
};

Compressor.prototype = {

    compressFiles: function(filePath)
    {
        var filePaths = this.getFilePaths(filePath);

        fs.readFile(filePaths.layoutPath, {encoding: 'utf8'}, this.onReadFile.bind(this, filePaths));
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
        if (err) {
            evento.trigger(messages.informerError, err)
            return
        }

        fs.writeFileSync(filePaths.layoutbackupPath, data)
        evento.trigger(messages.informerSuccess, 'Backup file created: ' + filePaths.layoutbackupPath)

        new ParseData(filePaths, data, this.options).run();
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