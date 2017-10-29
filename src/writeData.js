/**
 * Created by jamie on 10/09/2017.
 */
'use strict';
const fs = require('fs-extra');
const _ = require('lodash');
const logger = require('./logger')(__filename);
const retreiveData = require('./retrieveData');
const config = require('./config');

function writeJsonDataToFile(dataFile, jsonData) {
	return fs.outputJson(dataFile, jsonData, {spaces: '\t'});
}

function createHistoryData(data) {
	if (data) {
		return fs.outputJson(config.dataHistoryFile, [data], {spaces: '\t'});
	} else {
		return retreiveData.getForecastData()
			.then((latestData) => {
				logger.info(latestData);
				return fs.outputJson(config.dataHistoryFile, [latestData], {spaces: '\t'});
			});
	}
}

function saveIfNewEntry(historyDataArray, latestData) {
	const foundDuplicate = _.find(historyDataArray, function (dataItem) { return dataItem.timeIssued === latestData.timeIssued; });
	if (foundDuplicate) {
		logger.info('found entry already in history so not saving');
	} else {
		logger.info(`Found an entry of: ${foundDuplicate} so updating`);
		const joinedDataArray = historyDataArray.concat(latestData);
		return fs.outputJson(config.dataHistoryFile, joinedDataArray, {spaces: '\t'});
	}
}

function saveAndReturnLatestData() {
	return retreiveData.getForecastData()
		.then((latestData) => {
			writeJsonDataToFile(config.latestDataFile, latestData);
			return latestData;
		});
}

function updateHistoryData(existingData) {
	return fs.pathExists(config.dataHistoryFile).then((exists) => {
		if (!exists) {
			logger.info('creating new history Data');
			return createHistoryData(existingData);
		} else {
			logger.info('Don\'t need to create history data');
			fs.readJson(config.dataHistoryFile).then((historyDataArray) => {
				//logger.info(historyDataArray);
				if (existingData) {
					logger.info('updateHistoryData with data param');
					return saveIfNewEntry(historyDataArray, existingData);
				} else {
					logger.info('updateHistoryData with new data');
					return saveAndReturnLatestData().then((latestData) => {
						return saveIfNewEntry(historyDataArray, latestData);
					});
				}
			});
		}
	});
}

function saveAndReturnLatestImage() {
	return retreiveData.getLatestForecastImage().then((imageData) => {
		fs.writeFile(config.latestSouthImageFile, imageData, {encoding: 'binary'});
		return imageData;
	});
}

function saveAndReturnLatestWingKpForecastData() {
	return retreiveData.getShortTermForecast()
		.then((latestData) => {
			writeJsonDataToFile(config.wingKpDataFile, latestData);
			return latestData;

		});
}

function saveAndReturnLatestMonthForecastData() {
	return retreiveData.getMonthForecastData()
		.then((latestData) => {
			writeJsonDataToFile(config.monthForecastFile, latestData);
			return latestData;
		});
}

function saveAndReturnLatestAuroraMapData() {
	return retreiveData.getLatestNowCastMap()
		.then((latestData) => {
			writeJsonDataToFile(config.mapAuroraNowCastFile, latestData);
			return latestData;
		});
}

function saveAndReturnLatestKpData() {
	return retreiveData.getLatestKpValue()
		.then((latestData) => {
			writeJsonDataToFile(config.latestKpValuesFile, latestData);
			return latestData;
		});
}

module.exports.saveAndReturnLatestData = saveAndReturnLatestData;
module.exports.updateHistoryData = updateHistoryData;
module.exports.saveAndReturnLatestImage = saveAndReturnLatestImage;
module.exports.saveAndReturnLatestWingKpForecastData = saveAndReturnLatestWingKpForecastData;
module.exports.saveAndReturnLatestMonthForecastData = saveAndReturnLatestMonthForecastData;
module.exports.saveAndReturnLatestAuroraMapData = saveAndReturnLatestAuroraMapData;
module.exports.saveAndReturnLatestKpData = saveAndReturnLatestKpData;