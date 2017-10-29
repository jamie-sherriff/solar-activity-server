'use strict';
const when = require('when');
const _ = require('lodash');
const {waitTimeMinutes} = require('./config');
const readData = require('./readData');
const email = require('./email');
let memoryStore = require('./memoryStore');
const msInMinute = 60000;
const mapping = require('./mapping');
const DEFAULT_ERROR_LIMIT = 100;
const logger = require('./logger')(__filename);

function checkErrorCount(count, limit, name) {
	if (count > limit) {
		throw new Error(`${name} has reached max error tries of ${count}/${limit}`);
	}
}

function latest3dayForecastPoll(waitMinutes, errorCount) {
	checkErrorCount(errorCount, DEFAULT_ERROR_LIMIT, 'latest3dayForecastPoll');
	const delayTime = msInMinute * waitMinutes + _.random(msInMinute, msInMinute * 2);
	logger.info(`Starting getLatest3dayForecastPoll with delayTime: ${delayTime}`);
	return when('Start delay')
		.delay(delayTime)
		.then(() => {
			return readData
				.getLatest3DayForecastData(waitMinutes)
				.then((latestData) => {
					memoryStore.threeDayForeCast = latestData;
					latest3dayForecastPoll(waitMinutes, errorCount);
				})
				.catch((error) => {
					logger.error(`getLatest3dayForecastPoll error: ${error}`);
					logger.warn(`latest3dayForecastPoll increasing errorCount to ${errorCount} for: ${error}`);
					latest3dayForecastPoll(waitMinutes, errorCount += 1);
				});
		});
}

function latestWingKpPoll(waitMinutes, errorCount) { //ShortTermForecast
	checkErrorCount(errorCount, DEFAULT_ERROR_LIMIT, 'latestWingKpPoll');
	const delayTime = msInMinute * waitMinutes + _.random(msInMinute, msInMinute * 2);
	logger.info(`Starting latestWingKpPoll with delayTime: ${delayTime}`);
	return when('Start delay')
		.delay(delayTime)
		.then(() => {
			return readData
				.getLatestWingKpData(waitMinutes)
				.then((latestData) => {
					let emailObject = email.checkShortTermForeCast(latestData);
					email.sendEmailsForObject(emailObject).then((results) => {
						logger.info(results);
					});
					memoryStore.wingKp = latestData;
					latestWingKpPoll(waitMinutes, errorCount);
				})
				.catch((error) => {
					logger.error(`latestWingKpPoll error: ${error}`);
					logger.warn(`latestWingKpPoll increasing errorCount to ${errorCount} for: ${error}`);
					latestWingKpPoll(waitMinutes, errorCount += 1);
				});
		});
}

function latestSouthImagePoll(waitMinutes, errorCount) {
	checkErrorCount(errorCount, DEFAULT_ERROR_LIMIT, 'latestSouthImagePoll');
	const delayTime = msInMinute * waitMinutes + _.random(msInMinute, msInMinute * 2);
	logger.info(`Starting latestSouthImagePoll with delayTime: ${delayTime}`);
	return when('Start delay')
		.delay(delayTime)
		.then(() => {
			return readData
				.getLatestSouthImage(waitMinutes)
				.then((latestData) => {
					memoryStore.latestSouthImage = latestData;
					latestSouthImagePoll(waitMinutes, errorCount);
				})
				.catch((error) => {
					logger.error(`latestSouthImagePoll error: ${error}`);
					logger.warn(`latestSouthImagePoll increasing errorCount to ${errorCount} for: ${error}`);
					latestSouthImagePoll(waitMinutes, errorCount += 1);
				});
		});
}

function latestKpValuesPoll(waitMinutes, errorCount) {
	checkErrorCount(errorCount, DEFAULT_ERROR_LIMIT, 'latestKpValuesPoll');
	const delayTime = msInMinute * waitMinutes + _.random(msInMinute, msInMinute * 2);
	logger.info(`Starting latestKpValuesPoll with delayTime ${delayTime}`);
	return when('Start delay')
		.delay(delayTime)
		.then(() => {
			return readData
				.getLatestKpValues(waitMinutes)
				.then((latestData) => {
					memoryStore.latestKpList = latestData;
					latestKpValuesPoll(waitMinutes, errorCount);
				})
				.catch((error) => {
					logger.error(`latestKpValuesPoll error: ${error}`);
					logger.warn(`latestKpValuesPoll increasing errorCount to ${errorCount} for: ${error}`);
					latestKpValuesPoll(waitMinutes, errorCount += 1);
				});
		});
}

function latestAuroraNowCastMapPoll(waitMinutes, errorCount) {
	checkErrorCount(errorCount, DEFAULT_ERROR_LIMIT, 'latestAuroraNowCastMapPoll');
	const delayTime = msInMinute * waitMinutes + _.random(msInMinute, msInMinute * 2);
	logger.info(`Starting latestAuroraNowCastMapPoll with delayTime ${delayTime}`);
	return when('Start delay')
		.delay(delayTime)
		.then(() => {
			return readData
				.getLatestAurorNowCastMap(waitMinutes)
				.then((latestData) => {
					memoryStore.auroraNowCastMap = mapping.processData(latestData.data);
					latestAuroraNowCastMapPoll(waitMinutes, errorCount);
				})
				.catch((error) => {
					logger.error(`latestAuroraNowCastMap error: ${error}`);
					logger.warn(`latestAuroraNowCastMap increasing errorCount to ${errorCount} for: ${error}`);
					latestAuroraNowCastMapPoll(waitMinutes, errorCount += 1);
				});
		});
}

function latestMonthForecastPoll(waitMinutes, errorCount) {
	checkErrorCount(errorCount, DEFAULT_ERROR_LIMIT, 'latestMonthForecastPoll');
	const delayTime = msInMinute * waitMinutes + _.random(msInMinute, msInMinute * 2);
	logger.info(`Starting latestMonthForecastPoll with  delayTime ${delayTime}`);
	return when('Start delay')
		.delay(delayTime)
		.then(() => {
			return readData
				.getLatestMonthForecastData(waitMinutes)
				.then((latestData) => {
					memoryStore.monthForecast = latestData;
					latestMonthForecastPoll(waitMinutes, errorCount);
				})
				.catch((error) => {
					logger.error(`latestMonthForecastPoll error: ${error}`);
					logger.warn(`latestMonthForecastPoll increasing errorCount to ${errorCount} for: ${error}`);
					latestMonthForecastPoll(waitMinutes, errorCount += 1);
				});
		});
}

function runDataPolling() {
	latest3dayForecastPoll(waitTimeMinutes.threeDayForeCast, 0);
	latestWingKpPoll(waitTimeMinutes.wingKp, 0);
	latestSouthImagePoll(waitTimeMinutes.latestSouthImage, 0);
	latestKpValuesPoll(waitTimeMinutes.latestKpList, 0);
	latestAuroraNowCastMapPoll(waitTimeMinutes.auroraNowCastMap, 0);
	latestMonthForecastPoll(waitTimeMinutes.monthForecast, 0);
}

module.exports.runDataPolling = runDataPolling;