#!/usr/bin/env node

const commander     = require("commander")
const evento        = require("evento")
const informer      = require("informer")
const packageData   = require("../package.json")
const Compressor    = require("../lib/compressor")
const Options       = require('../lib/options')
const messages      = require('../lib/messages')

informer.title(packageData.name)
    .titleColor("grey");

evento.on(messages.informerError,   informer.error.bind(informer));
evento.on(messages.informerInfo,    informer.info.bind(informer));
evento.on(messages.informerLoading, informer.loading.bind(informer));
evento.on(messages.informerSuccess, informer.success.bind(informer));
evento.on(messages.informerWarning, informer.warning.bind(informer));

evento.on(messages.commanderHelp, function() {
    commander.outputHelp()
})

commander.version(packageData.version)
    .usage("[options] [dir]")
    .option('-c, --config <n>', 'path to a configuration file (e.g. compressor/config.json)')
    .option('-e, --env <n>', 'environment (e.g. production, stage, dev, local ...)')
    .parse(process.argv);

new Compressor(new Options(commander.config, commander.env)).run()