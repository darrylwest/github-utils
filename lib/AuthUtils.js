#!/usr/bin/env node

// dpw@alameda.local
// 2015.04.16

var AuthUtils = function() {
    'use strict';

    var utils = this;

    this.readAuthString = function(completeCallback) {
        var fs = require('fs'),
            file = process.env.HOME + '/.ssh/github';

        fs.readFile( file, function(err, data) {
            if (err) throw err;

            var s = new Buffer( data.toString(), 'hex' ).toString('utf8');

            completeCallback( err, s );
        });
    };
};


module.exports = AuthUtils;

