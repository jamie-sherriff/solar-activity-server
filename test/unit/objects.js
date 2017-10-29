'use strict';

import test from 'ava';
import * as config from '../../src/config';
import * as memoryStore from '../../src/memoryStore';
import * as regexes from '../../src/regexes';

test('config has correct keys', t => {
	const expectedKeys = Object.keys(config);
	t.snapshot(expectedKeys)
});

test('memoryStore has correct keys', t => {
	const expectedKeys = Object.keys(memoryStore);
	t.snapshot(expectedKeys)
});

test('regexes has correct keys', t => {
	const expectedKeys = Object.keys(regexes);
	t.snapshot(expectedKeys)
});