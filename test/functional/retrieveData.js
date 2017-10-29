'use strict';

import test from 'ava';
import * as retrieveData from '../../src/retrieveData';
import _ from 'lodash';
test('latestKp Data can be retrieved', t => {
	return retrieveData.getLatestKpValue().then((latestData)=>{
		const expectedKeys = Object.keys(latestData);
		t.snapshot(expectedKeys);
		const expectedAllKpKeys = Object.keys(latestData.allKp);
		const expectedLatestKpKeys = Object.keys(latestData.latestKpObject);
		t.snapshot(expectedAllKpKeys);
		t.snapshot(expectedLatestKpKeys);
	})
});

test('getForecast Data can be retrieved', t => {
	return retrieveData.getForecastData().then((latestData)=>{
		const expectedKeys = Object.keys(latestData);
		t.snapshot(expectedKeys);
	})
});

test('getLatestForecastImage Data can be retrieved', t => {
	return retrieveData.getLatestForecastImage().then((latestData)=>{
		t.true(_.isBuffer(latestData), 'getLatestForecastImage must return a buffer');
	})
});

test('getMonthForecast Data can be retrieved', t => {
	return retrieveData.getMonthForecastData().then((latestData)=>{
		const expectedKeys = Object.keys(latestData);
		t.snapshot(expectedKeys);
	})
});

test('getShortTermForecast Data can be retrieved', t => {
	return retrieveData.getShortTermForecast().then((latestData)=>{
		const expectedKeys = Object.keys(latestData);
		t.snapshot(expectedKeys);
	})
});

test('getLatestNowCastMap Data can be retrieved', t => {
	return retrieveData.getLatestNowCastMap().then((latestData)=>{
		const expectedKeys = Object.keys(latestData);
		t.snapshot(expectedKeys);
	})
});