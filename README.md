# Solar Activity Server

## What is this?
* A Node.js Application that uses[expressjs.com](https://expressjs.com//) to host a rest API that retrieves solar data from [NOAA/NWS](http://www.swpc.noaa.gov/) 
(National Oceanic Atmospheric Administration/National Weather Service) and outputs most of the data in JSON (JavaScript Object Notation).
* The various sources of data has come from [swpc noaa data](http://www.swpc.noaa.gov/products-and-data)
* The main purpose of this service is to predict [Auroras](http://www.swpc.noaa.gov/phenomena/aurora) Triggered from solar activity.


## Live Demo
* The service can be viewed online at [Solar Service](https://solar.sherriff.kiwi/solar)
* A client app that retrieves and displays the data can be viewed at [Solar App](https://solar.sherriff.kiwi)

## Requirements:

* NodeJs 6+
* A maxmind city DB for reverse geo ip lookups Source: (https://dev.maxmind.com/maxmind-db/) A helper script is located in /helpers can download this.
* A Gmail email setup that uses OAuth2


## How to run?
* Download a maxmind db from above and extract to /static
* Set the DEFAULT_SOLAR_PORT environment variable for production use port to host the server on
* `npm start` which is alias for `npm install && node index.js`

## Documentation
* Can be viewed in html form at  This is an [Solar Docs on Github](https://jamie-sherriff.github.io/solar-activity-server)
* Can also be viewed in[Markdown Format](https://github.com/jamie-sherriff/solar-activity-server/blob/master/docs/index.md)

## Running for development
* `npm run dev`
* This runs the server with nodaemon for auto restarting on code changes

## Running Tests
* `npm test`

## Checking code style
* `npm run lint`

## Generate docs
* `npm run doc`

## Contributions ##
* Always welcome 

## Contributing guidelines
* Write tests
* Check tests pass
* Write docs if applicable
* Check linting
* Do a Pull request
