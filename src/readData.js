/**
 * Created by jamie on 9/09/2017.
 */
'use strict';
const fs = require('fs-extra');
const moment = require('moment');
const _ = require('lodash');
const writeData = require('./writeData');
const logger = require('./logger')(__filename);
const config = require('./config');

function readDataFromFile(filePath) {
	return fs.readJson(filePath).then((data) => {
		return data;
	}).catch((error) => {
		logger.error(error);
		return null;
	});
}

function readLatestDataFromFile() {
	return readDataFromFile(config.latestDataFile);
}

function readHistoryDataFromFile() {
	return readDataFromFile(config.dataHistoryFile);
}

function readWingKpDataFromFile() {
	return readDataFromFile(config.wingKpDataFile);
}

function readMonthDataFromFile() {
	return readDataFromFile(config.monthForecastFile);
}


function getLatest3DayForecastData(minutesToWait) {
	return readLatestDataFromFile().then((fileData) => {
		const difference = moment().diff(fileData.retrievedAt, 'minutes');
		if (difference > minutesToWait) {
			logger.info(`getting new data as dataTime is: ${fileData.retrievedAt} and difference is: ${difference}`);
			return writeData.saveAndReturnLatestData();
		} else {
			logger.info(`Sending getLatest3DayForecastData fileData  as difference is: ${difference}`);
			return fileData;
		}
	}).catch((error) => {
		logger.warn(`getting new data because of error: ${error}`);
		return writeData.saveAndReturnLatestData();
	});
}

function getLatestWingKpData(minutesToWait) {
	return readWingKpDataFromFile()
		.then((fileData) => {
			if (_.isNil(fileData)) {
				logger.info('getLatestWingKpData: fileData is Nil, Getting new data');
				return writeData.saveAndReturnLatestWingKpForecastData();
			} else {
				const difference = moment().diff(moment(fileData.retrievedAt), 'minutes');
				if (difference > minutesToWait) {
					logger.info(`getLatestWingKpData: getting new data as dataTime is: ${fileData.retrievedAt} and difference is: ${difference}`);
					return writeData.saveAndReturnLatestWingKpForecastData();
				} else {
					logger.info(`Sending getLatestWingKpData fileData as difference is: ${difference}`);
					return fileData;
				}
			}
		});
}

function getLatestMonthForecastData(minutesToWait) {
	return readMonthDataFromFile()
		.then((fileData) => {
			if (_.isNil(fileData)) {
				logger.info('getLatestMonthForecastData: fileData is Nil, Getting new data');
				return writeData.saveAndReturnLatestMonthForecastData();
			} else {
				const difference = moment().diff(moment(fileData.retrievedAt), 'minutes');
				if (difference > minutesToWait) {
					logger.info(`getLatestMonthForecastData: getting new data as dataTime is: ${fileData.retrievedAt} and difference is: ${difference}`);
					return writeData.saveAndReturnLatestMonthForecastData();
				} else {
					logger.info(`Sending getLatestMonthForecastData fileData as difference is: ${difference}`);
					return fileData;
				}
			}
		});
}

function getLatestAurorNowCastMap(minutesToWait) {
	return readDataFromFile(config.mapAuroraNowCastFile)
		.then((fileData) => {
			if (_.isNil(fileData)) {
				logger.info('getLatestAurorNowCastMap: fileData is Nil, Getting new data');
				return writeData.saveAndReturnLatestAuroraMapData();
			} else {
				const difference = moment().diff(moment(fileData.retrievedAt), 'minutes');
				if (difference > minutesToWait) {
					logger.info(`getLatestAurorNowCastMap: getting new data as dataTime is: ${fileData.retrievedAt} and difference is: ${difference}`);
					return writeData.saveAndReturnLatestAuroraMapData();
				} else {
					logger.info(`Sending getLatestAurorNowCastMap fileData as difference is: ${difference}`);
					return fileData;
				}
			}
		});
}

function getLatestKpValues(minutesToWait) {
	return readDataFromFile(config.latestKpValuesFile)
		.then((fileData) => {
			if (_.isNil(fileData)) {
				logger.info('getLatestKpValues: fileData is Nil, Getting new data');
				return writeData.saveAndReturnLatestKpData();
			} else {
				const difference = moment().diff(moment(fileData.retrievedAt), 'minutes');
				if (difference > minutesToWait) {
					logger.info(`getLatestKpValues: getting new data as dataTime is: ${fileData.retrievedAt} and difference is: ${difference}`);
					return writeData.saveAndReturnLatestKpData();
				} else {
					logger.info(`Sending getLatestKpValues fileData as difference is: ${difference}`);
					return fileData;
				}
			}
		});
}

function getLatestSouthImage(staleImageMinutes) {
	return fs.stat(config.latestSouthImageFile).then((fileStats) => {
		const modTime = moment(fileStats.mtime);
		const difference = moment().diff(modTime, 'minutes');
		if (difference > staleImageMinutes) {
			logger.info(`getting new getLatestSouthImage Mtime is: ${modTime} and difference is: ${difference}`);
			return writeData.saveAndReturnLatestImage();
		} else {
			logger.info(`Sending image from: ${config.latestSouthImageFile}`);
			return fs.readFile(config.latestSouthImageFile, {encoding: null});
		}
	}).catch((error) => {
		logger.error(error);
		if (error.code === 'ENOENT') { //does not exist case
			logger.warn('getLatestSouthImage ENOENT so getting new image');
			return writeData.saveAndReturnLatestImage();
		} else {
			throw Error(error);
		}
	});
}

module.exports.getLatest3DayForecastData = getLatest3DayForecastData;
module.exports.readLatestDataFromFile = readLatestDataFromFile;
module.exports.readHistoryDataFromFile = readHistoryDataFromFile;
module.exports.getLatestSouthImage = getLatestSouthImage;
module.exports.getLatestWingKpData = getLatestWingKpData;
module.exports.getLatestMonthForecastData = getLatestMonthForecastData;
module.exports.getLatestAurorNowCastMap = getLatestAurorNowCastMap;
module.exports.getLatestKpValues = getLatestKpValues;