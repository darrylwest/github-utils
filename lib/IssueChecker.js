#!/usr/bin/env node

// dpw@alameda.local
// 2015.04.16
// e.g.: curl -u 'user:pw' https://api.github.com/repos/darrylwest/PROJECT/issues

var dash = require('lodash'),
    log = require('simple-node-logger').createSimpleLogger(),
    agent = require('superagent'),
    Config = require('./Config'),
    AuthUtils = require('./AuthUtils');

var IssueChecker = function(options) {
    'use strict';

    var checker = this,
        github = options.github,
        user,
        pw

    this.queryIssues = function(project, completeCallback) {
        var obj = {
                repo:project,
                issues:[]
            },
            url = [ github, project, 'issues' ].join('/'),
            request,
            callback;

        callback = function(err, results) {
            if (err) throw err;

            log.info( results );
        };

        log.info('check for issues in project: ', project, ', url: ', url);

        /*
        request = agent.get( url );
        request.accept('application/json');
        request.auth( user, pw );
        request.end( callback );
        */

        completeCallback( null, obj );

    };

    this.check = function(projects, completeCallback) {
        var issueList = [];

        log.info('check issues for projects: ', projects.length);

        var loop = function(err, issues) {
            if (err) throw err;

            if (issues && issues.issues.length > 0) {
                issueList.push( issues );
            }

            var project = projects.shift();

            if (project) {
                checker.queryIssues( project, loop );
            } else {
                completeCallback( null, issueList );
            }
        };

        readAuth( loop );
    };

    var readAuth = function(callback) {
        new AuthUtils().readAuthString(function(err, as) {
            var parts = as.split(':');
            user = parts[0];
            pw = parts[1]

            callback();
        });
    }
};

IssueChecker.checkAllProjects = function() {
    var config = new Config(),
        checker = new IssueChecker( config );

    checker.check( config.repos, function(err, issues) {
        if (err) throw err;

        if (issues.length === 0) {
            log.info('complete, zero issues...');
        } else {
            issues.forEach(function(issue) {
                log.info( '- ', issue);
            });
        }
    });
};

module.exports = IssueChecker;

