#!/usr/bin/env node

// dpw@alameda.local
// 2015.04.18
var dash = require('lodash'),
    log = require('simple-node-logger').createSimpleLogger(),
    Config = require('./Config');

var ScriptRunner = function(options) {
    'use strict';

    var runner = this,
        exec = require('child_process').exec,
        home = options.sourceFolder;

    this.run = function(repo, cmd, completeCallback) {
        var path = [ home, repo ].join('/');

        log.info('repo: ', path, ', cmd: ', cmd);

        process.chdir( path );
        log.info( process.cwd() );

        completeCallback();
    };

};

ScriptRunner.pullAll = function() {
    'use strict';

    var config = new Config(),
        runner = new ScriptRunner( config ),
        repos = dash.clone( config.repos );

    var loop = function(err) {
        if (err) throw err;

        var repo = repos.shift();

        if (repo) {
            runner.run( repo, 'git pull', loop );
        } else {
            log.info('run complete...');
        }
    };

    loop();
};

module.exports = ScriptRunner;

