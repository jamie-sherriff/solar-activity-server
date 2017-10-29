const request = require('request');
const fs = require('fs-extra');
const MAXMIND_URL =  'http://geolite.maxmind.com/download/geoip/database/GeoLite2-City.tar.gz';
const MAXMIND_MD5_URL = 'http://geolite.maxmind.com/download/geoip/database/GeoLite2-City.tar.gz.md5';

let length;
let received =0;
let progress;
request(MAXMIND_URL)
	.on('response', (response)  => {
		length = parseInt(response.headers['content-length'], 10);
		})
	.on('data', function (chunk) {
		if (chunk.length){
			received += chunk.length;
			progress = (received /length) * 100;
			console.log(`${progress} %`)
		}
	})
	.pipe(fs.createWriteStream('../static/GeoLite2-City.tar.gz'))
	.on('finish', ()  => {
		console.log('maxmind download complete');
	});
