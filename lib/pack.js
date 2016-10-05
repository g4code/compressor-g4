
const packer    = require('node.packer')
const evento    = require('evento')
const messages  = require('./messages')

function Pack() {

};

Pack.prototype = {

    run: function(block)
    {
        evento.trigger(messages.informerInfo, 'Block data: ' + [block.name, block.type, block.source].join(', '))

        packer({
            log     : true,
            minify  : true,
            uglify  : block.type === 'js' ? true : false,
            input   : block.type === 'js' ? block.filesTmp : block.files,
            output  : block.output,
            callback: function (err, code){
                if (err) {
                    evento.trigger(messages.informerError, err)
                }
            }
        })
    }
}

module.exports = Pack;