'use strict';
const util = require('util');
const moment = require('moment-timezone');
const nodemailer = require('nodemailer');
const when = require('when');
const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const memoryStore = require('./memoryStore');
let SECRET_CONFIG = {};
let EMAIL_CONFIG = {};
const logger = require('./logger')(__filename);
const config = require('./config');

if (process.env.SOLAR_SERVICE_SECRET_CONFIG_PATH) {
	const secretConfigPath = path.resolve(process.env.SOLAR_SERVICE_SECRET_CONFIG_PATH);
	SECRET_CONFIG = require(secretConfigPath);
	EMAIL_CONFIG = SECRET_CONFIG.gmail;
} else {
	throw new Error('Need SOLAR_SERVICE_SECRET_CONFIG_PATH set');
}

function readDataFromFile(filePath) {
	return fs.readJson(filePath).then((data) => {
		return data;
	}).catch((error) => {
		logger.error(error);
		return null;
	});
}

function writeJsonDataToFile(dataFile, jsonData) {
	fs.copy(dataFile, dataFile + '.bak').then(() => {
		return fs.outputJson(dataFile, jsonData, {spaces: '\t'});
	});
}

let frequencyStates = {
	NEVER: 0,
	ONCE: 1,
	HOURLY: 2,
	ANY: 3
};

let subscriptionStates = {
	Hourly: false,
	Daily: false,
};

function returnEmailUser(emailJson) {
	return {
		emailAddress: emailJson.email,
		name: emailJson.usersName,
		created: moment().toISOString(),
		lastUpdated: moment().toISOString(),
		lastEmailTime: null,
		alertKpLevel: emailJson.kpValue,
		signUpEmailTime: null,
		emailFailureCount: 0
	};
}

const smtpTransport = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		type: 'OAuth2',
		user: EMAIL_CONFIG.user,
		clientId: EMAIL_CONFIG.clientId,
		clientSecret: EMAIL_CONFIG.clientSecret,
		refreshToken: EMAIL_CONFIG.refreshToken
	}
});

function sendEmail(destAddress, subject, body) {
	logger.info(`Sending email to ${destAddress} with subject: ${subject} with a body length of ${body.length}`);
		let mailOptions = {
			from: EMAIL_CONFIG.user, // sender address
			to: destAddress, // list of receivers
			subject: subject, // Subject line
			text: body, // plain text body
		};
		return smtpTransport.sendMail(mailOptions);
}

function readUserFile() {
	return readDataFromFile(config.userDataFile)
		.then((jsonData) => {
			if (_.isNil(jsonData)) { //first time init case
				return fs.outputJson(config.userDataFile, {}).then(() => {
					return {};
				});
			} else {
				return jsonData;
			}
		});
}

function formatAndValidateUser(newUser) {
	return returnEmailUser(newUser);
}

const welcomeEmailTemplate = 'Hi %s,\nThis is confirmation that you have been subscribed' +
	' to solar service alerts at your alert level of %s Kp';

function sendWelcomeEmail(newUser) {
	if (_.isNil(newUser.signUpEmailTime)) {
		const subject = `Welcome to solar service alerts`;
		const body = util.format(welcomeEmailTemplate, newUser.name, newUser.alertKpLevel);
		sendEmail(newUser.emailAddress, subject, body).then(() => {
			logger.info(`Email for ${newUser.emailAddress} succeeded`);
		});
	}
}

function addUserToStore(newUser) {
	//TODO Check if user is on the ban list
	newUser = formatAndValidateUser(newUser);
	const doesExit = _.has(memoryStore.userStore, newUser.emailAddress);
	let message;
	if (doesExit) {
		logger.info(`Updating user ${JSON.stringify(newUser)}`);
		message = `Your email ${newUser.emailAddress} has been updated`;
		const currentUser = _.cloneDeep(memoryStore.userStore[newUser.emailAddress]);
		memoryStore.userStore[newUser.emailAddress] = _.merge(currentUser, newUser);
		memoryStore.userStore[newUser.emailAddress].lastUpdated = moment().toISOString();
	} else {
		logger.info(`Adding new user ${JSON.stringify(newUser)}`);
		sendWelcomeEmail(newUser);
		newUser.signUpEmailTime = moment().toISOString();
		message = `Your email ${newUser.emailAddress} has been added`;
		memoryStore.userStore[newUser.emailAddress] = newUser;
	}
	writeJsonDataToFile(config.userDataFile, memoryStore.userStore);
	return {message};
}

function removeUserFromStore(user) {
	logger.info(user);
	const doesExit = _.has(memoryStore.userStore, user.emailAddress);
	let message, status;
	if (doesExit) {
		status = 'success';
		message = `Your email ${user.emailAddress} has been removed`;
		delete memoryStore.userStore[user.emailAddress];
	} else {
		status = 'error';
		message = `This email does not exist`;
	}
	writeJsonDataToFile(config.userDataFile, memoryStore.userStore);
	//TODO send confirmation email sendWelcomeEmail(newUsers)
	return {status, message};
}

function checkShortTermForeCast(shortTermForecastData) {
	logger.info(`Checking ShortTermForeCast for alerts to send`);
	const dateFormat = shortTermForecastData.dataDateFormat;
	const userFriendlyDate = 'dddd hh:mm A';
	const currentTime = moment();
	let emailUsersObject = {};
	_.forIn(shortTermForecastData.data, (valuesAtTime, dateInData) => {
		const oneHourTime = moment.tz(valuesAtTime.predicted1HourTime, dateFormat, 'UTC').local();
		const fourHourTime = moment.tz(valuesAtTime.predicted4HourTime, dateFormat, 'UTC').local();
		//const dateDataTime = moment.tz(dateInData, dateFormat, 'UTC').local();
		if (oneHourTime.isSameOrAfter() || (fourHourTime.isSameOrAfter())) {
			const kpValue = _.round(valuesAtTime.predicted1HourKpValue, 2);
			_.forIn(memoryStore.userStore, (userData, userName) => {
				const sameDayEmail = currentTime.isSame(moment(userData.lastEmailTime), 'day');
				if (userData.alertKpLevel <= _.round(kpValue) && sameDayEmail === false) { //round value 0dp but give real value to user
					if (_.has(emailUsersObject, userName) === false) {
						emailUsersObject[userName] = {alertArray: [], userDetails: userData, foundTimes: []};
					}
					const alreadyOneHourTime = _.includes(emailUsersObject[userName].foundTimes, oneHourTime.toISOString());
					const alreadyFourHourTime = _.includes(emailUsersObject[userName].foundTimes, oneHourTime.toISOString());
					if (alreadyOneHourTime || alreadyFourHourTime) {
						//Do Nothing
					} else if (oneHourTime.isSameOrAfter()) {
						emailUsersObject[userName].alertArray.push([`${kpValue} Kp at ${oneHourTime.format(userFriendlyDate)}`]);
						emailUsersObject[userName].foundTimes.push(oneHourTime.toISOString());
					} else if (fourHourTime.isSameOrAfter()) {
						emailUsersObject[userName].alertArray.push([`${kpValue} Kp at ${fourHourTime.format(userFriendlyDate)}`]);
						emailUsersObject[userName].foundTimes.push(fourHourTime.toISOString());
					}
				}
			});
		}
	});
	return emailUsersObject;
}

function sendEmailsForObject(object) {
	if (_.isEmpty(object) === false) {
		const promises = [];
		_.forIn(object, (userData, emailAddress) => {
			let body = '';
			_.forEach(userData.alertArray, (alert) => {
				body += (alert + '\n');
			});
			body += 'More information can be found  at: https://solar.sherriff.kiwi';
			memoryStore.userStore[emailAddress].lastEmailTime = moment().toISOString();
			const subject = `Solar Service Update Alert for ${moment().local().format('dddd h:mm A')}`;
			promises.push(sendEmail(emailAddress, subject, body));
		});
		writeJsonDataToFile(config.userDataFile, memoryStore.userStore);
		return when.all(promises);
	} else {
		return when.resolve('No emails to send');
	}
}

module.exports.sendEmail = sendEmail;
module.exports.readUserFile = readUserFile;
module.exports.writeJsonDataToFile = writeJsonDataToFile;
module.exports.returnEmailUser = returnEmailUser;
module.exports.addUserToStore = addUserToStore;
module.exports.removeUserFromStore = removeUserFromStore;
module.exports.checkShortTermForeCast = checkShortTermForeCast;
module.exports.sendEmailsForObject = sendEmailsForObject;
