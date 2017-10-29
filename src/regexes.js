'use strict';
module.exports = {
	monthForecastDataGroupRegex: /(^\d{4}\s[A-Z][a-z]{2}\s\d{2})(\s.*\d{1,})$/,
	monthForecastDataRegex: /^\d{4}\s[A-Z][a-z]{2}\s\d{1,2}\s.*$/gm,
	/*
	:Product: 27-day Space Weather Outlook Table 27DO.txt
	* */
	titleRegex: /[A-Z][a-z]{2}\s\d{2}\s.*[A-Z][a-z]{2}\s\d{2}/,

	dataRegex: /^\d{2}-\d{2}UT\s.*$/gm,

	/*
	:Issued: 2017 Sep 11 0813 UTC
	*/
	timeIssuedRegex: /^:Issued:?(.*)$/m,
	createdRegex: /^:Created:?(.*)$/m,
	dataListRegex: /^:Data_list:?(.*)$/m,

	productRegex: /^:Product:?(.*)$/m,

	rationaleRegex: /Rationale:?([\s\S]+?)\.$/gm,

	/*
	The greatest observed 3 hr Kp over the past 24 hours was 5 (NOAA Scale
	G1)
	.*/
	greatedObserved3DayRegex: /The greatest observed:?[\s\S]+?\.$/,

	/*
	#   UTC      Radio Flux   Planetary   Largest
	#  Date       10.7 cm      A Index    Kp Index
	2017 Sep 11      85          10          4*/


	/*
	2017 09 18  0300    2017 09 18  0400     3.67    2017 09 18  0700     4.67       4.00
	2017 09 18  0315    2017 09 18  0415     3.33    2017 09 18  0715     4.33       4.00
*/
	shortForecastWithHistory: /^\d{4}.*\d$/gm


};