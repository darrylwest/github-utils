#!/usr/bin/env node

// dpw@alameda.local
// 2015.03.04
'use strict';

var fs = require('fs'),
    dash = require('lodash'),
    spawn = require('child_process').spawn,
    clearScreen = '[H[2J',
    files = [],
    tid,
    lastRun;

var run = function() {
    var cmd = './scripts/check-issues.js',
        runner = spawn( cmd, [ ] );

    lastRun = Date.now();

    process.stdout.write( clearScreen );
    if (files.length > 0) {
        console.log('Changed files:');
        files.forEach(function(file) {
            console.log( '\t', file );
        });
        console.log('\n');
    } else {
        console.log('last run timed out...');
    }

    runner.stdout.on('data', function( data ) {
        process.stdout.write( data );
    });

    runner.stderr.on('data', function( data ) {
        process.stdout.write( data );
    });

    runner.on('close', function(code) {
        if (code !== 0) {
            console.log( cmd, ' did not exit correctly, code: ', code);
        }

        console.log( '------------------------------------ last run: ', new Date().toISOString() );

        tid = null;
        files.splice( 0 );
    });
};

var changeHandler = function(event, filename) {
    if (dash.endsWith( filename, '.js' )) {
        // console.log( 'file change: ', filename);
        files.push( filename );

        if (!tid) {
            tid = setTimeout(function() {
                run();
            }, 250);
        }
    }
};

run();

fs.watch( 'lib/', { recursive:true }, changeHandler );
fs.watch( 'scripts/', { recursive:true }, changeHandler );

setInterval(function() {
    if (Date.now() - lastRun > (1000 * 60 * 10)) {
        run();
    }
}, 1000 * 60);

