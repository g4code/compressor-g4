#!/usr/bin/env node

var compressor = require("../lib/compressor"),
    commander      = require("commander"),
    packageData = require("../package.json");

commander.version(packageData.version)
    .usage("[options] [dir]")
    .option('-c, --config <n>', 'config directory path')
    .option('-e, --env <n>', 'environment')
    .parse(process.argv);

compressor.run(process.cwd()+'/'+commander.config, commander.env);