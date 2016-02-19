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

        log.info( 'path: ', path );

        loop = function(err) {
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

    this.execRepoCommands = function(repos, commands, completeCallback) {
        var repoList = dash.clone(repos),
            loop;

        loop = function(err) {
            if (err) throw err;

            var repo = repoList.shift();

            if (repo) {
                runner.run( repo, commands, loop );
            } else {
                if (typeof completeCallback === 'function') {
                    completeCallback();
                } else {
                    log.info('complete...');
                }
            }
        };

        log.info('exec command on repos: ', repoList );
        loop();
    };

    this.filterRepos = function(repoList) {
        var repos = dash.filter( repoList, function(repo) {
            var stats,
                path = [ home, repo ].join('/');

            if (repo !== 'github-utils') {
                try {
                    stats = fs.statSync( path );
                } catch (ignore) {
                    log.debug('repo path not found: ', path);
                }

                return (stats && stats.isDirectory());
            } else {
                return false;
            }
        });

        return repos;
    };
};

ScriptRunner.run = function(options) {
    var config = new Config(),
        runner = new ScriptRunner( config ),
        args = dash.slice( process.argv, 2 ),
        repos = runner.filterRepos( config.repos),
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

ScriptRunner.status = function(options) {
    'use strict';

    var config = new Config(),
        runner = new ScriptRunner( config ),
        loop,
        commands,
        repos = runner.filterRepos( config.repos );

    if (options) {
        commands = options.commands;
    } else {
        commands = [ 'git status' ];
    }

    runner.execRepoCommands( repos, commands );
};

ScriptRunner.pullAll = function(options) {
    'use strict';

    var config = new Config(),
        runner = new ScriptRunner( config ),
        loop,
        commands,
        repos = runner.filterRepos( config.repos );

    console.log('repo count: ', repos.length);

    if (!options) {
        options = {};
    }

    if (options.commands) {
        commands = dash.clone( options.commands );
    } else {
        commands = [ 'git status', 'git pull' ]; // , 'git pull', 'git co master', 'git pull', 'git co develop' ];
    }

    loop = function(err) {
        if (err) throw err;

        var repo = repos.shift();

        console.log('repo: ', repo);
        console.log('repo count: ', repos.length);

        if (repo) {
            runner.execCommands( repo, dash.clone( commands ), loop );
        } else {
            log.info('pull complete...');
        }
    };

    loop();
};

module.exports = ScriptRunner;

