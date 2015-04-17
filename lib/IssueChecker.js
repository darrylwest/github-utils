#!/usr/bin/env node

// dpw@alameda.local
// 2015.04.16

var dash = require('lodash'),
    log = require('simple-node-logger').createSimpleLogger(),
    agent = require('superagent'),
    Config = require('./Config'),
    AuthUtils = require('./AuthUtils');

var IssueChecker = function() {
    'use strict';

    var checker = this,
        auth;

    this.checkProject = function(project, completeCallback) {
        var obj = {
            project:project,
            issues:[]
        };

        log.info('check for issues in project: ', project);

        completeCallback( null, obj );
    };

    this.check = function(projects, completeCallback) {
        var issueList = [];

        log.info('check issues for projects: ', projects.length);

        var loop = function(err, issues) {
            if (err) throw err;

            if (issues) {
                issueList.push( issues );
            }

            var project = projects.shift();

            if (project) {
                checker.checkProject( project, loop );
            } else {
                completeCallback( null, issueList );
            }
        };


        loop();
    };

    new AuthUtils().readAuthString(function(err, as) {
        auth = as;
    });
};

IssueChecker.checkAllProjects = function() {
    var checker = new IssueChecker(),
        config = new Config();

    checker.check( config.projects, function(err, issues) {
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

