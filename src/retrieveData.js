/**
 * Created by jamie on 9/09/2017.
 */
'use strict';

const moment = require('moment');
const path = require('path');
const fs = require('fs-extra');
const rp = require('request-promise');
const os = require('os');
const packageJson = require('../package.json');
const debug = require('debug')('solar-activity');
const _ = require('lodash');
const regexes = require('./regexes');
const config = require('./config');
const logger = require('./logger')(__filename);

function formatRow(row) {
	let newRow = row.trim();
	newRow = newRow.replace(/\s{2,}/g, ',');
	return newRow;
}

function getUserAgent() {
	const nodeString = `NodeJs/${process.version}`;
	const packageString = `${packageJson.name}/${packageJson.version}`;
	const computerString = `Hostname/${os.hostname()} Platform/${os.platform()} PlatformVersion/${os.release()}`;
	return `${packageString} ${nodeString} ${computerString}`;
}

const customTransformStream = function (body, response) {
	return {'headers': response.headers, 'data': body, 'statusCode': response.statusCode};
};

const DEFUALT_REQUEST_OPTIONS = {timeout: 60000, 'User-Agent': getUserAgent(), transform: customTransformStream};

function writeErrorDataToFile(fileName, fileData) {
	const filePath = path.resolve(__dirname, '..', 'errorData', fileName);
	return fs.outputFile(filePath, fileData.toString(), {encoding: 'utf8'});
}

function formatData(data) {
	let newData = [];
	data.forEach((row) => {
		newData.push(formatRow(row).split(','));
	});
	return newData;
}

function getTimes(solarData) {
	let timeArray = [];
	solarData.forEach((data) => {
		timeArray.push(data.shift().trim());
	});
	return timeArray;
}

function formatDays(days, solarData, times) {
	let dayData = {};
	days.forEach((day, dayIndex) => {
		let parsedDay = moment(day, 'MMM DD').format('YYYY-MM-DD');
		dayData[parsedDay] = {};
		times.forEach((time, timeIndex) => {
			let formattedTime = moment(parsedDay + '-' + time, 'YYYY-MM-DD-HH-mm[UT]').format('HH-mm');
			//TODO keep track of G ratings on data somehow...
			dayData[parsedDay][formattedTime] = _.parseInt((solarData[timeIndex][dayIndex]).charAt(0));
		});
	});
	return dayData;
}

function formatMonthData(monthDataArray) {
	let monthForecast = {};
	monthDataArray.forEach((day) => {
		const dayDate = day[0].replace(/\s/g, '-');
		monthForecast[dayDate] = {};
		monthForecast[dayDate]['RadioFlux'] = _.parseInt(day[1]);
		monthForecast[dayDate]['PlanetaryAIndex'] = _.parseInt(day[2]);
		monthForecast[dayDate]['LargestKpIndex'] = _.parseInt(day[3]);
	});
	return monthForecast;
}

function getLatestKpValue() {
	const rpOptions = _.merge(_.cloneDeep(DEFUALT_REQUEST_OPTIONS), {json: true});
	let retreivedData;
	return rp(config.latestOneMinuteKIndexUrl, rpOptions)
		.then((response) => {
		let data = response.data;
		retreivedData = data;
		if (_.isArray(data) === false){
			logger.error(`data is not an array but is type ${typeof  data}: ${data}`);
			throw new Error('getLatestKpValue data must be an array');
		}
		const keyNames = data.shift();
		let latestKpObject = {};
		let allKp = {data: [], keys: keyNames};
		allKp.data = data;
		let latestItem = _.maxBy(data, function (item) {
			return moment(item[0], 'YYYY-MM-DD HH:mm:ss').valueOf();
		});
		keyNames.forEach((key, index) => {
			latestKpObject[key] = latestItem[index];
		});
		const retrievedAt = moment().toISOString();
		return {latestKpObject, allKp, retrievedAt};
	})
		.catch((error) => {
		logger.error(`getLatestKpValue error: ${error}`);
		logger.error(error.stack);
		const fileName = 'getLatestKpValue-' + moment().format('YYYY-MM-DD;HH-mm-ss-SSS') + '.txt';
		retreivedData = retreivedData + '\n\n' + error.stack;
		writeErrorDataToFile(fileName, retreivedData);
		throw error;
	});
}

function getMonthForecastData() {
	let retreivedData;
	const rpOptions = _.merge(_.cloneDeep(DEFUALT_REQUEST_OPTIONS), {encoding: 'utf8'});
	return rp(config.monthForecastUrl, rpOptions)
		.then((response) => {
			let data = response.data;
			retreivedData = data;
			if (_.isString(data) === false) {
				logger.info(`Found response data not as ${typeof data} ...converting to string`);
				data = data.toString();
			}
			const timeIssued = regexes.timeIssuedRegex.exec(data)[1].trim().replace(/\s+/g, '-');
			const productName = regexes.productRegex.exec(data)[1].trim();
			const monthData = formatData(data.match(regexes.monthForecastDataRegex));
			const formattedJson = formatMonthData(monthData);
			const solarJson = {
				timeIssued: timeIssued,
				retrievedAt: moment().toISOString(),
				product: productName,
				dataDateFormat: 'YYYY-MMM-DD',
				data: formattedJson,
			};
			logger.debug(solarJson);
			return solarJson;
		})
		.catch((error) => {
			logger.error(`getMonthForecastData error: ${error}`);
			const fileName = 'getMonthForecastData-' + moment().format('YYYY-MM-DD;HH-mm-ss-SSS') + '.txt';
			retreivedData = retreivedData + '\n\n' + error.stack;
			writeErrorDataToFile(fileName, retreivedData);
			throw error;
		});
}

function getForecastData() {
	let retreivedData;
	const rpOptions = _.merge(_.cloneDeep(DEFUALT_REQUEST_OPTIONS), {encoding: 'utf8'});
	return rp(config.forecastThreeDayUrl, rpOptions)
		.then((response) => {
			let data = response.data;
			retreivedData = data;
			// Reset regex because it is stateful with /g and got interrupted mid function
			regexes.rationaleRegex.lastIndex = 0;
			regexes.dataRegex.lastIndex = 0;
			const titles = formatRow(regexes.titleRegex.exec(data)[0]).split(',');
			const solarData = formatData(data.match(regexes.dataRegex));
			const timeIssuedformated = regexes.timeIssuedRegex.exec(data);
			const timeIssued = timeIssuedformated[1].trim().replace(/\s+/g, '-');
			//const timeIssued = moment(timeIssuedRegex.exec(data)[1].trim().replace(/\s+/g, '-'), 'YYYY-MMM-DD-HHmm-[UTC]').format();
			const productName = regexes.productRegex.exec(data)[1].trim();
			const rationales = [];
			let match = regexes.rationaleRegex.exec(data);
			while (match !== null) {
				rationales.push(match[1]);
				match = regexes.rationaleRegex.exec(data);
			}
			const timeArray = getTimes(solarData);
			let formattedJson = formatDays(titles, solarData, timeArray);
			const solarJson = {
				timeIssued: timeIssued,
				retrievedAt: moment().toISOString(),
				product: productName,
				data: formattedJson,
				unitString: 'Kp',
				dateFormat: 'YYYY-MM-DD', hourFormat: 'HH-mm',
				rationale: rationales[0],
				observed: {description: '', value: ''},
				expected: {description: '', value: '', atTime: null}
			};
			debug(solarJson);
			return solarJson;
		})
		.catch((error) => {
			logger.error(`getForecastData error: ${error}`);
			const fileName = 'getForecastDataError-' + moment().format('YYYY-MM-DD;HH-mm-ss-SSS') + '.txt';
			retreivedData = retreivedData + '\n\n' + error.stack;
			writeErrorDataToFile(fileName, retreivedData);
			throw error;
		});
}

function getLatestForecastImage() {
	const rpOptions = _.merge(_.cloneDeep(DEFUALT_REQUEST_OPTIONS), {encoding: null});
	return rp(config.ovationImageSouthUrl, rpOptions).then((response) => {
		return response.data;
	});
}


function getLatestNowCastMap() {
	const rpOptions = _.merge(_.cloneDeep(DEFUALT_REQUEST_OPTIONS), {encoding: 'utf8'});
	return rp(config.auroraNowCastMapUrl, rpOptions).then((response) => {
		return {product: null, validAt: null, generatedAt: null, retrievedAt: moment().toISOString(),  data: response.data};
	});
}


function getShortTermForecast() {
	let retreivedData;
	const rpOptions = _.merge(_.cloneDeep(DEFUALT_REQUEST_OPTIONS), {encoding: 'utf8'});
	return rp(config.shortForecastWithHistoryUrl, rpOptions)
		.then((response) => {
			let data = response.data;
			retreivedData = data;
			let matchedRegex = data.match(regexes.shortForecastWithHistory);
			let shortTermForecastObject = {};
			matchedRegex.forEach((row) => {
				let dataArray = row.trim().replace(/\s\s+/g, ',').replace(/\s+/g, '-').split(',');
				//Data in form ["2017-09-18","0600","2017-09-18","0700","4.33","2017-09-18","1000","5.00","5.00"]
				if (dataArray.length !== 9) {
					throw new Error(`getShortForecastWithHistory Data validation error with: ${JSON.stringify(row)}`);
				}
				let observedDate = dataArray[0] + ':' + dataArray[1];
				let predicted1HourTime = dataArray[2] + ':' + dataArray[3];
				let predicted1HourKpValue = _.toNumber(dataArray[4]);
				let predicted4HourTime = dataArray[5] + ':' + dataArray[6];
				let predicted4HourKpValue = _.toNumber(dataArray[7]);
				let predicted4HourKpUsafValue = _.toNumber(dataArray[8]);
				shortTermForecastObject[observedDate] = {
					predicted1HourTime,
					predicted1HourKpValue,
					predicted4HourTime,
					predicted4HourKpValue,
					predicted4HourKpUsafValue
				};
			});
			return {retrievedAt: moment().toISOString(), dataDateFormat: 'YYYY-MM-DD:HHmm', data: shortTermForecastObject};
		})
		.catch((error) => {
			logger.error(`getShortTermForecast error: ${error}`);
			const fileName = 'getShortTermForecast-' + moment().format('YYYY-MM-DD;HH-mm-ss-SSS') + '.txt';
			retreivedData = retreivedData + '\n\n' + error.stack;
			writeErrorDataToFile(fileName, retreivedData);
			throw error;
		});
}

module.exports.getForecastData = getForecastData;
module.exports.getLatestKpValue = getLatestKpValue;
module.exports.getLatestForecastImage = getLatestForecastImage;
module.exports.getMonthForecastData = getMonthForecastData;
module.exports.getShortTermForecast = getShortTermForecast;
module.exports.getLatestNowCastMap = getLatestNowCastMap;
