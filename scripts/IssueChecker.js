#!/usr/bin/env node

// dpw@alameda.local
// 2015.04.16

var dash = require('lodash'),
    log = require('simple-node-logger').createSimpleLogger(),
    agent = require('superagent'),
    AuthUtils = require('./read-auth');

var IssueChecker = function() {
    'use strict';

    var checker = this,
        auth;

    this.check = function(projects, completeCallback) {
        log.info('check issues for projects: ', projects.length);

        completeCallback( null, [] );
    };

    new AuthUtils().readAuthString(function(err, as) {
        auth = as;
    });
};

IssueChecker.checkAllProjects = function() {
    var checker = new IssueChecker();
    
    projects = [ 'simple-node-logger', 'mock-browser' ];

    checker.check( projects, function(err, issues) {
        if (err) throw err;

        log.info('complete, issue count: ', issues.length);
    });
};
