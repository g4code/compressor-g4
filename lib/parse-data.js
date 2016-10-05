
var fs          = require('fs'),
    path        = require('path'),
    evento      = require('evento')
    messages    = require('./messages')
    Block       = require('./block');

function ParseData(filePaths, data, options) {

    this.filePaths  = filePaths;
    this.layoutData = data;
    this.options    = options;
};

ParseData.prototype = {

    onEachBlock: function(value)
    {
        var oneBlock = new Block().run(value, this.options);
        this.layoutData = this.layoutData.replace(oneBlock.raw, oneBlock.embedCode);
    },

    run: function()
    {
        var matches = this.layoutData.match(/\{\#\scompressor\stype\:.+?\sname\:.+?\s#\}[^]+?\{\#\scompressor\send\s\#\}/g);

        if (matches === null) {
            evento.trigger(messages.informerWarning, 'Matches found: 0')
            return
        }

        var matchesLength = matches.length
        evento.trigger(messages.informerSuccess, 'Matches found: ' + matchesLength)

        for (var i = 0; i < matchesLength; i++) {
            this.onEachBlock(matches[i])
        }

        fs.writeFile(this.filePaths.layoutPath, this.layoutData, {encoding: 'utf8'});
        evento.trigger(messages.informerSuccess, 'Changes saved to file: ' + this.filePaths.layoutPath)
    }
};

module.exports = ParseData;