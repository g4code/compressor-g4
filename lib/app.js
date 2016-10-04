
const Compressor = require('./compressor')


function App(options) {

    this.options = options
}

App.prototype = {

    run: function()
    {
        new Compressor(this.options).run()
    }
}

module.exports = App