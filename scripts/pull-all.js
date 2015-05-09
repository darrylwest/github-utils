#!/usr/bin/env node

// dpw@alameda.local
// 2015.04.18
'use strict';

var ScriptRunner = require('../lib/ScriptRunner'),
    opts = {
        commands:[ 'git pull', 'git co master', 'git pull', 'git co develop' ]
    };

ScriptRunner.pullAll( opts );

