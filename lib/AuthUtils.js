#!/usr/bin/env node

// dpw@alameda.local
// 2015.04.16

var AuthUtils = function() {
    'use strict';

    var utils = this,
        user,
        pw;

    this.init = function(completeCallback) {
        var fs = require('fs'),
            file = process.env.HOME + '/.ssh/github';

        fs.readFile( file, function(err, data) {
            if (err) throw err;

            var s = new Buffer( data.toString(), 'hex' ).toString('utf8');

            var parts = s.split(':');

            user = parts[0];
            pw = parts[1];

            completeCallback( err );
        });
    };

    this.createQueryOptions = function(url) {
        var opts = {
            url:url,
            method:'GET',
            headers:{
                'accept':'application/json',
                'content-type':'application/json',
                'user-agent':'darrylwest-api-utils'
            },
            auth: {
                user:user, 
                pass:pw,
                sendImmediately:false
            }
        };

        return opts;
    };
};

module.exports = AuthUtils;

