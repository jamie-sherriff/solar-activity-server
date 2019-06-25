'use strict';
const path = require('path');
const waitTimeMinutes = {
	latestSouthImage: 360,
	latestKpList: 6,
	threeDayForeCast: 5,
	wingKp: 9999,
	auroraNowCastMap: 180,
	monthForecast: 1440
};

module.exports = {
	emailWaitHours: 24,
	waitTimeMinutes: waitTimeMinutes,
	latestDataFile: path.resolve(__dirname, '..', 'data', '3dayDataLatest.json'),
	wingKpDataFile: path.resolve(__dirname, '..', 'data', 'latestWing-kp.json'),
	dataHistoryFile: path.resolve(__dirname, '..', 'data', '3dayDataHistory.json'),
	monthForecastFile: path.resolve(__dirname, '..', 'data', 'monthForecast.json'),
	latestSouthImageFile: path.resolve(__dirname, '..', 'data', 'latestSouthImage.json'),
	mapAuroraNowCastFile: path.resolve(__dirname, '..', 'data', 'mapAuroraCast.json'),
	latestKpValuesFile: path.resolve(__dirname, '..', 'data', 'latestKpValues.json'),
	userDataFile: path.resolve(__dirname, '..', 'data', 'userDataFile.json'),
	forecastThreeDayUrl: 'http://services.swpc.noaa.gov/text/3-day-forecast.txt',
	latestOneMinuteKIndexUrl: 'http://services.swpc.noaa.gov/products/noaa-estimated-planetary-k-index-1-minute.json',
	monthForecastUrl: 'http://services.swpc.noaa.gov/text/27-day-outlook.txt',
	shortForecastWithHistoryUrl: 'http://services.swpc.noaa.gov/text/wing-kp.txt',
	ovationImageSouthUrl: 'http://services.swpc.noaa.gov/images/animations/ovation-south/latest.jpg',
	auroraNowCastMapUrl: 'http://services.swpc.noaa.gov/text/aurora-nowcast-map.txt'
};