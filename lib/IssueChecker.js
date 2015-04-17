#!/usr/bin/env node

// dpw@alameda.local
// 2015.04.16
// e.g.: curl -u 'user:pw' https://api.github.com/repos/darrylwest/PROJECT/issues

var dash = require('lodash'),
    log = require('simple-node-logger').createSimpleLogger(),
    request = require('request'),
    Config = require('./Config'),
    AuthUtils = require('./AuthUtils');

var IssueChecker = function(options) {
    'use strict';

    var checker = this,
        github = options.github,
        authUtils = new AuthUtils();

    this.queryIssues = function(project, completeCallback) {
        var url = [ github, project, 'issues' ].join('/'),
            opts = authUtils.createQueryOptions( url ),
            callback;

        callback = function(err, response, body) {
            if (err) throw err;

            if (response.statusCode !== 200) {
                log.error( 'bad response status code: ', response.statusCode );
            }

            var obj = {
                repo:project,
                issues:JSON.parse( body )
            };

            log.info( obj );

            completeCallback( null, obj );
        };

        log.info('check for issues in project: ', project, ', url: ', url);

        request.get( opts, callback );
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

        authUtils.init( loop );
    };
};

IssueChecker.checkAllProjects = function() {
    var config = new Config(),
        checker = new IssueChecker( config ),
        repos = config.repos; // dash.take( config.repos, 1 );

    checker.check( repos, function(err, issues) {
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

