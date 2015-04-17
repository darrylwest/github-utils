#!/usr/bin/env node

// dpw@alameda.local
// 2015.04.16
'use strict';

var dash = require('lodash'),
    agent = require('superagent'),
    AuthUtils = require('./read-auth');

new AuthUtils().readAuthString(function(err, as) {
    console.log( as );
});

