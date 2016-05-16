compressor-g4
======

> compressor-g4 - [nodejs](http://nodejs.org) library

## Install

    $ npm install -g compressor-g4

## Usage

```
  Usage: compressor [options] [dir]

  Options:

    -h, --help        output usage information
    -V, --version     output the version number
    -c, --config <n>  path to a configuration file (e.g. compressor/config.json)
    -e, --env <n>     environment (e.g. production, stage, dev, local ...)

```

e.g.
```bash
$ compressor-g4 --config compressor/config.json --env stage
```

Inside of a twig template file

```html
{# compressor type:css name:inline_filename source:inline #}
    <link type="text/css" rel="stylesheet" href="/path/to/inline_filename1.css" />
    <link type="text/css" rel="stylesheet" href="/path/to/inline_filename2.css" />
    <link type="text/css" rel="stylesheet" href="/path/to/inline_filename3.css" />
{# compressor end #}

{# compressor type:css name:external_filename #}
    <link type="text/css" rel="stylesheet" href="/path/to/external_filename1.css" />
    <link type="text/css" rel="stylesheet" href="/path/to/external_filename2.css" />
{# compressor end #}

{# compressor type:js name:filename #}
    <script src="/path/to/filename1.js"></script>
    <script src="/path/to/filename2.js"></script>
    <script src="/path/to/filename3.js"></script>
{# compressor end #}
```


### Config options

* layouts: array - paths to html/template files where links for css and js files are located
* publicPath: string - path to a document root (public folder)
* tmpPath: string - path to a temp folder
* compressedFilePrefix: object for environment specific file prefix 

e.g.
```
{
    "layouts":[
        "application/templates/layout01.twig",
        "application/templates/layout02.twig"
    ],
    "publicPath"    : "../public",
    "tmpPath"       : "tmp",
    "compressedFilePrefix" : {
        "production" : "//cdn.example.com",
        "stage"      : "//cdn.stage.example.com",
        "dev"        : "//cdn.dev.int"
    }
}
```



## Development

### Install dependencies

    $ make install

### Run tests

    $ make test

## License

(The MIT License)
see LICENSE file for details...
