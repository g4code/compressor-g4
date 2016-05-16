#!/usr/bin/env node

var compressor = require("../lib/compressor"),
    commander      = require("commander"),
    packageData = require("../package.json");

commander.version(packageData.version)
    .usage("[options] [dir]")
    .option('-c, --config <n>', 'path to a configuration file (e.g. compressor/config.json)')
    .option('-e, --env <n>', 'environment (e.g. production, stage, dev, local ...)')
    .parse(process.argv);

compressor.run(process.cwd()+'/'+commander.config, commander.env);