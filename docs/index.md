<a name="top"></a>
# solar-activity-server v1.0.0

solar activity server that retreives data from NOAA

- [email](#email)
	- [email subscribe](#email-subscribe)
	- [email Unsubscribe](#email-unsubscribe)
	
- [forecast](#forecast)
	- [Request three day forecast](#request-three-day-forecast)
	- [Request All Latest Kp values](#request-all-latest-kp-values)
	- [latest forecast Now map](#latest-forecast-now-map)
	- [latest forecast image](#latest-forecast-image)
	- [Request Latest Kp value](#request-latest-kp-value)
	- [Request Month forecast](#request-month-forecast)
	- [short term forecast](#short-term-forecast)
	
- [internal](#internal)
	- [root](#root)
	
- [location](#location)
	- [get city information for current location by ip Address](#get-city-information-for-current-location-by-ip-address)
	


# email

## email subscribe
[Back to top](#top)



	POST /emailSubscribe





### Parameter Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| emailJson | object | <p>json object that contains a potential email client</p>|


### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| message | string | <p>contains message for result</p>|

## email Unsubscribe
[Back to top](#top)



	POST /removeEmailSubscribe





### Parameter Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| emailJson | object | <p>json object that contains a potential email client to remove</p>|


### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| message | string | <p>contains message for result</p>|

# forecast

## Request three day forecast
[Back to top](#top)



	GET /3dayforecast





### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| timeIssued | String | <p>ISO8601 string</p>|
| retrievedAt | String | <p>ISO8601 string</p>|
| product | String | <p>Description source of where data has come from</p>|
| data | Object | <p>dataObject that contains objects of days</p>|
| unitString | String | <p>unit string of data</p>|
| dateFormat | String | <p>format time of days</p>|
| hourFormat | String | <p>format time of data values</p>|
| rationale | String | <p>Text description of forecast</p>|
| observed | String | <p>Not yet complete</p>|
| expected | String | <p>Not yet complete</p>|

## Request All Latest Kp values
[Back to top](#top)



	GET /allLatestKp





### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| data | String[] | <p>array of arrays that contains kp values in an array</p>|
| array | string[] | <p>that contains key strings to the data arrays respective to their indexes</p>|

## latest forecast Now map
[Back to top](#top)



	GET /auroraForecastNowMap





### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| array | Object[] | <p>of objects that contain lat,lng and weights</p>|

## latest forecast image
[Back to top](#top)



	GET /latestForecastImage





### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| latestForecastImage | String | <p>encoded in base64</p>|

## Request Latest Kp value
[Back to top](#top)



	GET /latestKp





### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| time_tag | String | <p>time value of kp value</p>|
| estimated_kp | Number | <p>unrounded number value of estimated kp</p>|
| kp | String | <p>string representing Kp with letter suffix</p>|

## Request Month forecast
[Back to top](#top)



	GET /monthForecast





### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| timeIssued | String | <p>ISO8601 string</p>|
| retrievedAt | String | <p>ISO8601 string</p>|
| product | String | <p>Description source of where data has come from</p>|
| data | Object | <p>dataObject that contains objects of days</p>|
| dataDateFormat | String | <p>time format of data object days</p>|

## short term forecast
[Back to top](#top)



	GET /shortTermForecast





### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| timeIssued | String | <p>, ISO8601 string</p>|
| retrievedAt | String | <p>ISO8601 string</p>|
| data | Object | <p>dataObject that contains objects of days</p>|

# internal

## root
[Back to top](#top)



	GET /





### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| version | String | <p>time on server in epoch</p>|
| docs | String | <p>docs endpoint location</p>|
| status | String | <p>status endpoint location</p>|
| description | String | <p>description of service</p>|
| name | String | <p>name of service</p>|

# location

## get city information for current location by ip Address
[Back to top](#top)



	POST /getLocation





### Parameter Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| full | string | <p>if true return all info for city</p>|


### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| location | string | <p>contains city information nfor location</p>|
| city | [object] | <p>Contains all city information</p>|

