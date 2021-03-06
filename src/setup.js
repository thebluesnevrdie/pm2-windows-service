'use strict';

const inquirer = require('inquirer'),
    node_windows = require('node-windows'),
    common = require('./common');

exports.retrieve = function() {
    return inquirer.prompt([{
        type: 'confirm',
        name: 'perform_setup',
        message: 'Perform environment setup (recommended)?',
        default: true
    }]).then(answers => answers.perform_setup ?
        inquirer.prompt([{
            type: 'confirm',
            name: 'SET_PM2_HOME',
            message: 'Set PM2_HOME?'
        }, {
            // Offer to update PM2_HOME
            type: 'input',
            name: 'PM2_HOME',
            message: 'PM2_HOME value (this path should be accessible to the service user and\nshould not contain any "user-context" variables [e.g. %APPDATA%]):',
            default: process.env.PM2_HOME || '',
            when(answers) {
                return answers.SET_PM2_HOME;
            }
        }, {
            type: 'confirm',
            name: 'SET_PM2_SERVICE_SCRIPTS',
            message: 'Set PM2_SERVICE_SCRIPTS (the list of start-up scripts for pm2)?'
        }, {
            // Set PM2_SERVICE_SCRIPTS up (optional)
            type: 'input',
            name: 'PM2_SERVICE_SCRIPTS',
            message: 'Set the list of startup scripts/files (semi-colon separated json config\nfiles or js files)',
            default: process.env.PM2_SERVICE_SCRIPTS || '',
            when(answers) {
                return answers.SET_PM2_SERVICE_SCRIPTS;
            }
        }, {
            type: 'confirm',
            name: 'SET_PM2_SERVICE_PM2_DIR',
            message: 'Set PM2_SERVICE_PM2_DIR (the location of the global pm2 to use with the service)? [recommended]'
        }, {
            // Set PM2_SERVICE_PM2_DIR up, to support using global pm2 version (non-optional?)
            type: 'input',
            name: 'PM2_SERVICE_PM2_DIR',
            message: 'Specify the directory containing the pm2 version to be used by the\nservice',
            default: process.env.PM2_SERVICE_PM2_DIR || common.guess_pm2_global_dir(),
            when(answers) {
                return answers.SET_PM2_SERVICE_PM2_DIR;
            }
        }]) :
        {}
    );
};

exports.configure = function(config) {
    // Perform setup based on answers object
    const command_promises = Object.keys(config)
        // Filter to only recognised answers
        .filter(key => ['PM2_HOME', 'PM2_SERVICE_SCRIPTS', 'PM2_SERVICE_PM2_DIR'].indexOf(key) >= 0)
        // Convert answers to promises resolved/rejected by elevated SETX command executions
        .map(key => new Promise((resolve, reject) => {
            node_windows.elevate(`SETX ${key} "${config[key]}" /m`, err => {
                if(err) {
                    return reject(err);
                }

                resolve();
            });
        }));

    // Return a promise which combines all the commands being executed
    return Promise.all(command_promises);
}
