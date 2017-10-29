'use strict';
const winston = require('winston');
const path  = require('path');

module.exports = function (fileName) {
	fileName = `${path.parse(fileName).name || 'UndefinedModuleName'}`;
	return new winston.Logger({
		transports: [
			// new (winston.transports.File)({
			// 	filename: 'MyLogs.txt',
			// 	handleExceptions: true,
			// 	humanReadableUnhandledException: true,
			// 	level: 'info',
			// 	timestamp: true,
			// 	json: false
			// }),
			new (winston.transports.Console)({
				prettyPrint: true,
				colorize: true,
				timestamp: true,
				handleExceptions: true,
				humanReadableUnhandledException: true,
				label: fileName
			})
		],
		exitOnError: false
	});
};