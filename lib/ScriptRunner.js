#!/usr/bin/env node

// dpw@alameda.local
// 2015.04.18
var dash = require('lodash'),
    fs = require('fs'),
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

        var loop,
            path = [ home, repo ].join('/');

        loop = function(err) {
            if (err) throw err;

            var cmd = commands.shift();

            if (cmd) {
                runner.run( repo, cmd, loop );
            } else {
                completeCallback( err );
            }
        };

        log.info('check the repo/path: ', path);

        // first check the file structure...
        fs.stat(path, function(err, stats) {
            if (err) {
                log.warn( err );
                completeCallback();
            } else {
                loop();
            }
        });
    };
};

ScriptRunner.run = function() {
    var config = new Config(),
        runner = new ScriptRunner( config ),
        args = dash.slice( process.argv, 2 ),
        repos = dash.filter( config.repos, function(repo) {
            return repo !== 'github-utils';
        }),
        loop,
        cmd;

    if (args && args.length > 0) {
        cmd = args.join( ' ' );
    } else {
        console.log( 'USE: ', process.argv[1], ' command args...');
        process.exit( -1 );
    }

    loop = function(err) {
        if (err) throw err;

        var repo = repos.shift();

        if (repo) {
            runner.run( repo, cmd, loop );
        } else {
            log.info('complete...');
        }
    };

    loop();
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

