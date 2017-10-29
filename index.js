/**
 * Created by jamie on 10/09/2017.
 */
'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');
const packageJson = require('./package.json');
const readData = require('./src/readData');
const mapping = require('./src/mapping');
const email = require('./src/email');
const moment = require('moment');
const location = require('./src/location');
const polling = require('./src/polling');
const {waitTimeMinutes} = require('./src/config');
const when = require('when');
const ipaddr = require('ipaddr.js');
let memoryStore = require('./src/memoryStore');
let cityLookup = null;
const logger = require('./src/logger')(__filename);

logger.info(`Running in mode: ${process.env.NODE_ENV || 'dev'}`);
let LISTEN_PORT;
const startTime = moment();
const app = express();
const jsonParser = bodyParser.json();

if (process.env.NODE_ENV === 'production') {
	app.enable('trust proxy');
	LISTEN_PORT = (process.env.DEFAULT_SOLAR_PORT) ? _.parseInt(process.env.DEFAULT_SOLAR_PORT) : 3000;
} else {
	LISTEN_PORT = 3000;
}

function updateAllDataNow() {
	return when.join(
		readData.getLatest3DayForecastData(waitTimeMinutes.threeDayForeCast),
		readData.getLatestWingKpData(waitTimeMinutes.wingKp), //isShortTermForecast
		readData.getLatestSouthImage(waitTimeMinutes.latestSouthImage),
		readData.getLatestKpValues(waitTimeMinutes.latestKpList),
		readData.getLatestAurorNowCastMap(waitTimeMinutes.auroraNowCastMap),
		readData.getLatestMonthForecastData(waitTimeMinutes.monthForecast),
		email.readUserFile()
	).then((allDataArray) => {
		memoryStore.threeDayForeCast = allDataArray[0];
		memoryStore.wingKp = allDataArray[1];
		memoryStore.latestSouthImage = allDataArray[2];
		memoryStore.latestKpList = allDataArray[3];
		memoryStore.auroraNowCastMap = mapping.processData(allDataArray[4].data);
		memoryStore.monthForecast = allDataArray[5];
		memoryStore.userStore = allDataArray[6];
		let emailObject = email.checkShortTermForeCast(allDataArray[1]);
		email.sendEmailsForObject(emailObject, memoryStore.userStore).then((results) => {
			logger.info(results);
		});
	});
}

function runStartupItems() {
	return when
		.join(location.initMaxmind(), updateAllDataNow())
		.then((resolvedPromises) => {
			cityLookup = resolvedPromises[0];
		});
}

var serveStatic = require('serve-static');
app.use('/docs', serveStatic(path.join(__dirname, 'doc')));

/*Needed for accepting custom headers from web app*/
app.use(function (req, res, next) {
	var oneof = false;
	if (req.headers.origin) {
		res.header('Access-Control-Allow-Origin', req.headers.origin);
		oneof = true;
	}
	if (req.headers['access-control-request-method']) {
		res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
		oneof = true;
	}
	if (req.headers['access-control-request-headers']) {
		res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
		oneof = true;
	}
	if (oneof) {
		res.header('Access-Control-Max-Age', 60 * 60 * 24);
	}
	// intercept OPTIONS method
	if (oneof && req.method === 'OPTIONS') {
		res.sendStatus(200);
	}
	else {
		next();
	}
});

/**
 * @api {get} /3dayforecast Request three day forecast
 * @apiName 3dayforecast
 * @apiGroup forecast
 * @apiVersion 1.0.0
 *
 * @apiSuccess {String} timeIssued ISO8601 string
 * @apiSuccess {String} retrievedAt  ISO8601 string
 * @apiSuccess {String} product Description source of where data has come from
 * @apiSuccess {Object} data  dataObject that contains objects of days
 * @apiSuccess {String} unitString  unit string of data
 * @apiSuccess {String} dateFormat  format time of days
 * @apiSuccess {String} hourFormat  format time of data values
 * @apiSuccess {String} rationale  Text description of forecast
 * @apiSuccess {String} observed  Not yet complete
 * @apiSuccess {String} expected  Not yet complete
 */

app.get('/3dayforecast', (req, res) => {
	logger.info('getting 3day Forcecast');
	res.json(memoryStore.threeDayForeCast);
});

/**
 * @api {get} /shortTermForecast short term forecast
 * @apiName shortTermForecast
 * @apiGroup forecast
 * @apiVersion 1.0.0
 *
 * @apiSuccess {String} timeIssued, ISO8601 string
 * @apiSuccess {String} retrievedAt  ISO8601 string
 * @apiSuccess {Object} data  dataObject that contains objects of days
 */

app.get('/shortTermForecast', (req, res) => {
	logger.info('getting  shortTermForecast');
	res.json(memoryStore.wingKp);
});

/**
 * @api {get} /internal/status server status
 * @apiName status
 * @apiGroup internal
 * @apiVersion 1.0.0
 *
 * @apiSuccess {Number} current time on server in epoch
 * @apiSuccess {Number} upTimeSeconds  ISO8601 string
 * @apiSuccess {Number} upTimeDays   days server has been up
 * @apiSuccess {Number} startTime   epoch time started at
 */

app.get('/internal/status', (req, res) => {
	const upTime = moment().diff(startTime, 'seconds');
	const upTimeDays = moment().diff(startTime, 'days');
	res.json({
		time: moment().valueOf(),
		upTimeSeconds: upTime,
		upTimeDays: upTimeDays,
		startTime: startTime.toISOString()
	});
});

/**
 * @api {get} / root
 * @apiName status
 * @apiGroup internal
 * @apiVersion 1.0.0
 *
 * @apiSuccess {String} version time on server in epoch
 * @apiSuccess {String} docs  docs endpoint location
 * @apiSuccess {String} status   status endpoint location
 * @apiSuccess {String} description   description of service
 * @apiSuccess {String} name   name of service
 */

app.get('/', (req, res) => {
	res.json({
		name: packageJson.name,
		status: '/internal/status',
		docs: '/docs',
		version: packageJson.version,
		description: packageJson.description,
	});
});

/**
 * @api {get} /monthForecast Request Month forecast
 * @apiName monthForecast
 * @apiGroup forecast
 * @apiVersion 1.0.0
 *
 * @apiSuccess {String} timeIssued ISO8601 string
 * @apiSuccess {String} retrievedAt  ISO8601 string
 * @apiSuccess {String} product Description source of where data has come from
 * @apiSuccess {Object} data  dataObject that contains objects of days
 * @apiSuccess {String} dataDateFormat  time format of data object days
 */

app.get('/monthForecast', (req, res) => {
	logger.info('getting  monthforecast');
	res.json(memoryStore.monthForecast);
});

/**
 * @api {get} /latestKp Request Latest Kp value
 * @apiName latestKp
 * @apiGroup forecast
 * @apiVersion 1.0.0
 *
 * @apiSuccess {String} time_tag time value of kp value
 * @apiSuccess {Number} estimated_kp  unrounded number value of estimated kp
 * @apiSuccess {String} kp  string representing Kp with letter suffix
 */

app.get('/latestKp', (req, res) => {
	res.json(memoryStore.latestKpList.latestKpObject);
});

/**
 * @api {get} /allLatestKp Request All Latest Kp values
 * @apiName allLatestKp
 * @apiGroup forecast
 * @apiVersion 1.0.0
 *
 * @apiSuccess {String[]} data array of arrays that contains kp values in an array
 * @apiSuccess {string[]} array that contains key strings to the data arrays respective to their indexes
 */

app.get('/allLatestKp', (req, res) => {
	logger.info('Getting allRecentKp');
	res.json(memoryStore.latestKpList.allKp);
});

/**
 * @api {get} /latestForecastImage latest forecast image
 * @apiName latestForecastImage
 * @apiGroup forecast
 * @apiVersion 1.0.0
 *
 * @apiSuccess {String} latestForecastImage encoded in base64
 */

app.get('/latestForecastImage', (req, res) => {
	logger.info('Getting latestForcastImage');
	const imageData = memoryStore.latestSouthImage;
	res.status(200).send(imageData.toString('base64'));
});

/**
 * @api {get} /auroraForecastNowMap latest forecast Now map
 * @apiName auroraForecastNowMap
 * @apiGroup forecast
 * @apiVersion 1.0.0
 *
 * @apiSuccess {Object[]} array of objects that contain lat,lng and weights
 */

app.get('/auroraForecastNowMap', (req, res) => {
	logger.info('Getting auroraForecastNowMap');
	res.json(memoryStore.auroraNowCastMap);
});

/**
 * @api {post} /emailSubscribe email subscribe
 * @apiName emailSubscribe
 * @apiGroup email
 * @apiVersion 1.0.0
 *
 * @apiParam {object} emailJson json object that contains a potential email client
 * @apiSuccess {string} message contains message for result
 */

app.post('/emailSubscribe', jsonParser, (req, res) => {
	logger.info('getting emailSubscribe');
	//TODO error handling for malformed json props
	const emailJson = req.body;
	const result = email.addUserToStore(emailJson);
	res.json({message: result.message});
});

/**
 * @api {post} /removeEmailSubscribe email Unsubscribe
 * @apiName removeEmailSubscribe
 * @apiGroup email
 * @apiVersion 1.0.0
 *
 * @apiParam {object} emailJson json object that contains a potential email client to remove
 * @apiSuccess {string} message contains message for result
 */

app.post('/removeEmailSubscribe', jsonParser, (req, res) => {
	logger.info('getting removeEmailSubscribe');
	//TODO error handling for malformed json props
	const userJson = req.body;
	const result = email.removeUserFromStore(userJson);
	if (result.status === 'success') {
		res.json({message: result.message});
	} else if (result.status === 'error') {
		res.status(400).json({message: result.message, status: result.status});
	}
});

/**
 * @api {post} /getLocation  city location information for ip
 * @apiName getLocation
 * @apiGroup location
 * @apiVersion 1.0.0
 *
 * @apiParam {string} full if true return all info for city
 * @apiSuccess {string} location contains city information for location
 * @apiSuccess {[object]} city Contains all city information
 */

app.get('/getLocation', (req, res) => {
	const getFull = (req.query.full === 'true');
	logger.info('Getting getLocation');
	const sourceIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	const parsedIp = ipaddr.process(sourceIp).toString();
	const city = cityLookup.get(parsedIp);
	if (_.isNil(city)) {
		res.status(200).json({
			error: `could not find city for ip address: ${sourceIp} parsed to: ${parsedIp}`,
			location: {
				latitude: -43.5225,
				longitude: 172.5813,
				time_zone: 'Pacific/Auckland'
			}
		});
	} else {
		if (getFull) {
			res.json(city);
		} else {
			res.json({location: city.location});
		}
	}
});

runStartupItems()
	.then(() => {
		app.listen(LISTEN_PORT, () => {
			logger.info(`${packageJson.name} listening on port ${LISTEN_PORT}!`);
			polling.runDataPolling(memoryStore);
		});
	});