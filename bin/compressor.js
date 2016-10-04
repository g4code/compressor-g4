#!/usr/bin/env node

const App           = require("../lib/app")
const Options       = require('../lib/options')
const commander     = require("commander")
const packageData   = require("../package.json")
const evento        = require("evento")
const informer      = require("informer")

informer.title(packageData.name)
    .titleColor("grey");

evento.on("INFORMER|ERROR",     informer.error.bind(informer));
evento.on("INFORMER|INFO",      informer.info.bind(informer));
evento.on("INFORMER|LOADING",   informer.loading.bind(informer));
evento.on("INFORMER|SUCCESS",   informer.success.bind(informer));
evento.on("INFORMER|WARNING",   informer.warning.bind(informer));

evento.on("COMMANDER|HELP",     function() {
    commander.outputHelp()
})

commander.version(packageData.version)
    .usage("[options] [dir]")
    .option('-c, --config <n>', 'path to a configuration file (e.g. compressor/config.json)')
    .option('-e, --env <n>', 'environment (e.g. production, stage, dev, local ...)')
    .parse(process.argv);

new App(new Options(commander.config, commander.env)).run()