
var Config = function() {
    'use strict';
    var config = this,
        owner = 'darrylwest';

    this.github = 'https://api.github.com/repos/' + owner;

    this.repos = [
        'audio-stream-recorder',
        'aws-commons',
        'background-service-runner',
        'enigma-keyword-client',
        'enigma-keyword-service',
        'github-utils',
        'js-list-container',
        'mock-browser',
        'mock-redis-client',
        'node-file-utils',
        // 'node-jsdom',
        'node-messaging-commons',
        'node-service-commons',
        'node-svg',
        'priority-job-queue',
        'random-fixture-data',
        'simple-node-db',
        'simple-node-logger',
        'socket-logger',
        'socket-model',
        'web-app-runner',
        'websocket-access-service',
        'websocket-database-service',
        'websocket-logger-service',
        'websocket-spellcheck-service'
    ];

    this.sourceFolder = process.env.HOME + '/roundpeg';
};

module.exports = Config;

