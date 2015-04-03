
var path   = require('path'),
    fs     = require('fs'),
    _      = require('underscore'),
    packer = require('node.packer');


function Pack()
{

};

Pack.prototype = {

    run: function(block)
    {
        console.log(block.output);

        packer({
            log     : true,
            minify  : true,
            uglify  : block.type === 'js' ? true : false,
            input   : block.type === 'js' ? block.filesTmp : block.files,
            output  : block.output,
            callback: function (err, code){
                err && console.log(err);
            }
        });
    }
};

module.exports = new Pack();