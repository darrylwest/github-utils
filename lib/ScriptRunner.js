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

        exec( cmd, function(err, stdout, stderr) {
            if (err) throw err;

            log.info( stdout );
            completeCallback( err );
        });
    };

    this.execCommands = function(repo, commands, completeCallback) {

        var loop = function(err) {
            if (err) throw err;

            var cmd = commands.shift();

            if (cmd) {
                runner.run( repo, cmd, loop );
            } else {
                completeCallback( err );
            }
        };

        loop();
    };
};

ScriptRunner.pullAll = function() {
    'use strict';

    var config = new Config(),
        runner = new ScriptRunner( config ),
        loop,
        repos = dash.filter( config.repos, function(repo) {
            return repo !== 'github-utils';
        });

    loop = function(err) {
        if (err) throw err;

        var repo = repos.shift();

        if (repo) {
            runner.execCommands( repo, [ 'git pull', 'git status', 'git co master', 'git pull', 'git co develop' ], loop );
        } else {
            log.info('run complete...');
        }
    };

    loop();
};

module.exports = ScriptRunner;

