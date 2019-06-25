'use strict';
const _ = require('lodash');
const logger = require('./logger')(__filename);
const moment = require('moment-timezone');

const USER_FRIENDLY_DATE = 'dddd hh:mm A';

function check3DayForeCast(forecastObject, alertLevel, userTimeZone){
	logger.info(`Checking 3DayForeCast for alerts to send`);
	const alertArray =[];
	let forecastData = forecastObject.data;
	_.forIn(forecastData, (valuesAtTime, dateInData) => {
		//console.log(valuesAtTime);
		_.forIn(valuesAtTime, (kpValue, predicationTime) =>{
			if(kpValue >= alertLevel){
				const dateFormat = `${forecastObject.dateFormat} ${forecastObject.hourFormat}`;
				const formattedTime = moment.tz(`${dateInData} ${predicationTime}`, dateFormat, 'UTC').tz(userTimeZone).format(USER_FRIENDLY_DATE);
				const message = (`${formattedTime} Predicated Kp level of ${kpValue}`);
				alertArray.push(message);
			}
		})
	});
	return alertArray
}

module.exports.check3DayForeCast = check3DayForeCast;