
var fs   = require('fs'),
    _    = require('underscore'),
    Pack = require('./pack');


function Block() {

};

Block.prototype = {

    oneBlock: {
        dataMain : null,
        files    : [],
        filesTmp : [],
        name     : null,
        output   : null,
        raw      : null,
        source   : null,
        startTag : null,
        type     : null
    },

    getEmbedCode: function()
    {
        return this.oneBlock.type === 'js'
            ? this.getEmbedCodeJs()
            : this.getEmbedCodeCss();
    },

    getEmbedCodeCss: function()
    {
        return this.oneBlock.source == 'inline' ?
            "<style>\n" + fs.readFileSync(this.oneBlock.output, 'UTF8').replace(/\{/g, '{\n').replace(/\}/g, '}\n') + "\n</style>" :
            '<link rel="stylesheet" type="text/css" href="' + this.config.compressedFilePrefix[this.config.env] + '/' + this.oneBlock.relativeName + '" />';
    },

    getEmbedCodeJs: function()
    {
        return this.oneBlock.source == 'inline' ?
            '<script type="text/javascript">\n' + fs.readFileSync(this.oneBlock.output, 'UTF8') + '\n</script>' :
            '<script type="text/javascript" src="' + this.config.compressedFilePrefix[this.config.env] + '/' + this.oneBlock.relativeName + '" ' + (this.oneBlock.dataMain === undefined ? '' : 'data-main="' + this.config.compressedFilePrefix[this.config.env] + '/' + this.oneBlock.dataMain + '"') + '></script>';
    },

    getFileRegex: function()
    {
        return this.oneBlock.type === 'js'
            ? /\<script.*src\=\"(.*?)\"(\sdata-main\=\"(.*?)\"|\>)/
            : /\<link.*href\=\"(.*?)\"\s/;
    },

    moveFilesToTmp: function()
    {
        if (this.oneBlock.type == "js") {
            _.each(this.oneBlock.files, _.bind(this.moveOneFile, this));
        }
        return this;
    },

    moveOneFile: function(filePath, key)
    {
        fs.writeFileSync(this.oneBlock.filesTmp[key], ";\n" + fs.readFileSync(filePath).toString() + "\n;");
    },

    onParseOneLine: function(value)
    {
        var typeMatch = value.match(/\stype\:(.+?)\s/);
        if (typeMatch !== null) {
            this.oneBlock.startTag = value;
            this.oneBlock.type     = typeMatch[1];
            this.oneBlock.source   = 'external';
        }

        var sourceMatch = value.match(/\ssource\:(.+?)\s/);
        if (sourceMatch !== null) {
            this.oneBlock.source = sourceMatch[1];
        }

        var nameMatch = value.match(/\sname\:(.+?)\s/);
        if (nameMatch !== null) {
            this.oneBlock.name         = nameMatch[1];
            this.oneBlock.relativeName = this.oneBlock.type+"/"+this.oneBlock.name+this.timestamp()+'.min.'+this.oneBlock.type;
            this.oneBlock.output       = this.config.publicPath + "/" + this.oneBlock.relativeName;
        }

        var fileMatch = value.match(this.getFileRegex());
        if (fileMatch !== null) {
            this.oneBlock.dataMain = fileMatch[3];
            this.oneBlock.files.push(this.config.publicPath + "/" + fileMatch[1]);
            this.oneBlock.filesTmp.push(this.config.tmpPath + "/" + fileMatch[1].replace(/\//g, "_"));
        }
    },

    pack: function()
    {
        new Pack().run(this.oneBlock);
        return this;
    },

    parse: function()
    {
        this.oneBlock.files = [];
        this.oneBlock.filesTmp = [];
        _.each(this.oneBlock.raw.split("\n"), _.bind(this.onParseOneLine, this));
        return this;
    },

    run: function(block, config)
    {
        this.config = config;
        this.oneBlock.raw = block;

        this.parse()
            .moveFilesToTmp()
            .pack();

        this.oneBlock.embedCode = this.getEmbedCode();

        return this.oneBlock;
    },

    timestamp: function()
    {
        return new Date().getTime();
    }
};

module.exports = Block;