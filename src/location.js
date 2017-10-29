'use strict';
const path = require('path');
const dbPath = path.resolve(__dirname, '..', 'static', 'GeoLite2-City.mmdb');
const maxmind = require('maxmind');
const when = require('when');
const logger = require('./logger')(__filename);

function initMaxmind() {
	return when.promise((resolve, reject) => {
		maxmind.open(dbPath, (error, cityLookup) => {
			if (error) {
				logger.info(`initMaxmind error: ${error}`);
				reject(error);
			} else {
				logger.info('initMaxmind complete');
				resolve(cityLookup);
			}
		});
	});
}

module.exports.initMaxmind = initMaxmind;