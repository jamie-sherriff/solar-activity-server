'use strict';
const _ = require('lodash');
const skipChars = ['#', '\n'];

function processData(data) {
	let nCols, nRows;
	let rows = data.split(/[\n\r]+/g);
	rows = _.reject(rows, (row) => {
		return _.includes(skipChars, row[0]) || row === '';
	});
	nCols = _.first(rows).trim().split(/\s+/).length; //Spec says it should return 1024
	nRows = rows.length; //Spec says it should return 512
	let latSize = 180 / nRows;
	let longSize = 360 / nCols;
	let processed = [];
	_.each(rows, (row, rowIndex) => {
		let columns = row.split(/\s+/);
		columns = _.reject(columns, (col) => { return col === ''; });
		let points = _.map(columns, (column, colIndex) => {
			let value = parseInt(column, 10);
			if (value === 0) return null;
			let lat = (longSize * rowIndex - 90);
			let long = (latSize * colIndex - 180);
			return {
				lat: lat,
				lng: long,
				weight: value
			};
		});
		points = _.compact(points);
		processed = processed.concat(points);
	});
	return processed;
}

module.exports.processData = processData;