import test from 'ava';
import fs from 'fs-extra';
import path from 'path';
import * as regexes from '../../src/regexes';

test('3-day-forecast data can be parsed with regex', t => {
	regexes.rationaleRegex.lastIndex = 0;
	regexes.dataRegex.lastIndex = 0;
	return fs.readFile(path.join(__dirname, 'data', '3-day-forecast.txt'), 'utf8')
		.then((data) => {
			t.snapshot(regexes.titleRegex.exec(data)[0], 'title regex');
			t.snapshot(data.match(regexes.dataRegex), 'data regex');
			t.snapshot(regexes.productRegex.exec(data)[1], 'product regex');
			t.snapshot(regexes.timeIssuedRegex.exec(data)[1], 'time issued regex');
			const rationales = [];
			let match = regexes.rationaleRegex.exec(data);
			while (match !== null) {
				rationales.push(match[1]);
				match = regexes.rationaleRegex.exec(data);
			}
			t.snapshot(rationales, 'rationales regex');
		});
});

test('27-day-outlook data can be parsed with regex', t => {
	return fs.readFile(path.join(__dirname, 'data', '27-day-outlook.txt'), 'utf8')
		.then((data) => {
			t.snapshot(regexes.timeIssuedRegex.exec(data)[1], 'timeIssued regex');
			t.snapshot(regexes.productRegex.exec(data)[1], 'product regex');
			t.snapshot(data.match(regexes.monthForecastDataRegex), 'monthData regex');
		});
});

test('wing-kp data can be parsed with regex', t => {
	return fs.readFile(path.join(__dirname, 'data', 'wing-kp.txt'), 'utf8')
		.then((data) => {
			t.snapshot(data.match(regexes.shortForecastWithHistory), 'wing-kp regex');
		});
});
