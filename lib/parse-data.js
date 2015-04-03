
var fs     = require('fs'),
    path   = require('path'),
    _      = require('underscore'),
    block  = require('./block');

function parseData()
{

};

parseData.prototype = {

    layoutData: "",

    onEachBlock: function(value)
    {
        var oneBlock = block.run(value, this.config);
        this.layoutData = this.layoutData.replace(oneBlock.raw, oneBlock.embedCode);
    },

    run: function(filePaths, data, config)
    {
        this.filePaths = filePaths;
        this.layoutData = data;
        this.config = config;

        var matches = this.layoutData.match(/\{\#\scompressor\stype\:.+?\sname\:.+?\s#\}[^]+?\{\#\scompressor\send\s\#\}/g);
        _.each(matches, _.bind(this.onEachBlock, this));
        fs.writeFile(this.filePaths.layoutPath, this.layoutData, {encoding: 'utf8'});
    }

};

module.exports = new parseData();