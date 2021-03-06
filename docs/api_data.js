define({ "api": [
  {
    "type": "post",
    "url": "/emailSubscribe",
    "title": "email subscribe",
    "name": "emailSubscribe",
    "group": "email",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "object",
            "optional": false,
            "field": "emailJson",
            "description": "<p>json object that contains a potential email client</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>contains message for result</p>"
          }
        ]
      }
    },
    "filename": "./index.js",
    "groupTitle": "email"
  },
  {
    "type": "post",
    "url": "/removeEmailSubscribe",
    "title": "email Unsubscribe",
    "name": "removeEmailSubscribe",
    "group": "email",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "object",
            "optional": false,
            "field": "emailJson",
            "description": "<p>json object that contains a potential email client to remove</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>contains message for result</p>"
          }
        ]
      }
    },
    "filename": "./index.js",
    "groupTitle": "email"
  },
  {
    "type": "get",
    "url": "/3dayforecast",
    "title": "Request three day forecast",
    "name": "3dayforecast",
    "group": "forecast",
    "version": "1.0.0",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "timeIssued",
            "description": "<p>ISO8601 string</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "retrievedAt",
            "description": "<p>ISO8601 string</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "product",
            "description": "<p>Description source of where data has come from</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>dataObject that contains objects of days</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "unitString",
            "description": "<p>unit string of data</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "dateFormat",
            "description": "<p>format time of days</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "hourFormat",
            "description": "<p>format time of data values</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rationale",
            "description": "<p>Text description of forecast</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "observed",
            "description": "<p>Not yet complete</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "expected",
            "description": "<p>Not yet complete</p>"
          }
        ]
      }
    },
    "filename": "./index.js",
    "groupTitle": "forecast"
  },
  {
    "type": "get",
    "url": "/allLatestKp",
    "title": "Request All Latest Kp values",
    "name": "allLatestKp",
    "group": "forecast",
    "version": "1.0.0",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "data",
            "description": "<p>array of arrays that contains kp values in an array</p>"
          },
          {
            "group": "Success 200",
            "type": "string[]",
            "optional": false,
            "field": "array",
            "description": "<p>that contains key strings to the data arrays respective to their indexes</p>"
          }
        ]
      }
    },
    "filename": "./index.js",
    "groupTitle": "forecast"
  },
  {
    "type": "get",
    "url": "/auroraForecastNowMap",
    "title": "latest forecast Now map",
    "name": "auroraForecastNowMap",
    "group": "forecast",
    "version": "1.0.0",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "array",
            "description": "<p>of objects that contain lat,lng and weights</p>"
          }
        ]
      }
    },
    "filename": "./index.js",
    "groupTitle": "forecast"
  },
  {
    "type": "get",
    "url": "/latestForecastImage",
    "title": "latest forecast image",
    "name": "latestForecastImage",
    "group": "forecast",
    "version": "1.0.0",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "latestForecastImage",
            "description": "<p>encoded in base64</p>"
          }
        ]
      }
    },
    "filename": "./index.js",
    "groupTitle": "forecast"
  },
  {
    "type": "get",
    "url": "/latestKp",
    "title": "Request Latest Kp value",
    "name": "latestKp",
    "group": "forecast",
    "version": "1.0.0",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "time_tag",
            "description": "<p>time value of kp value</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "estimated_kp",
            "description": "<p>unrounded number value of estimated kp</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "kp",
            "description": "<p>string representing Kp with letter suffix</p>"
          }
        ]
      }
    },
    "filename": "./index.js",
    "groupTitle": "forecast"
  },
  {
    "type": "get",
    "url": "/monthForecast",
    "title": "Request Month forecast",
    "name": "monthForecast",
    "group": "forecast",
    "version": "1.0.0",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "timeIssued",
            "description": "<p>ISO8601 string</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "retrievedAt",
            "description": "<p>ISO8601 string</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "product",
            "description": "<p>Description source of where data has come from</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>dataObject that contains objects of days</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "dataDateFormat",
            "description": "<p>time format of data object days</p>"
          }
        ]
      }
    },
    "filename": "./index.js",
    "groupTitle": "forecast"
  },
  {
    "type": "get",
    "url": "/shortTermForecast",
    "title": "short term forecast",
    "name": "shortTermForecast",
    "group": "forecast",
    "version": "1.0.0",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "timeIssued",
            "description": "<p>, ISO8601 string</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "retrievedAt",
            "description": "<p>ISO8601 string</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>dataObject that contains objects of days</p>"
          }
        ]
      }
    },
    "filename": "./index.js",
    "groupTitle": "forecast"
  },
  {
    "type": "get",
    "url": "/",
    "title": "root",
    "name": "status",
    "group": "internal",
    "version": "1.0.0",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "version",
            "description": "<p>time on server in epoch</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "docs",
            "description": "<p>docs endpoint location</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>status endpoint location</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>description of service</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>name of service</p>"
          }
        ]
      }
    },
    "filename": "./index.js",
    "groupTitle": "internal"
  },
  {
    "type": "get",
    "url": "/internal/status",
    "title": "server status",
    "name": "status",
    "group": "internal",
    "version": "1.0.0",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "current",
            "description": "<p>time on server in epoch</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "upTimeSeconds",
            "description": "<p>ISO8601 string</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "upTimeDays",
            "description": "<p>days server has been up</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "startTime",
            "description": "<p>epoch time started at</p>"
          }
        ]
      }
    },
    "filename": "./index.js",
    "groupTitle": "internal"
  },
  {
    "type": "post",
    "url": "/getLocation",
    "title": "get city information for current location by ip Address",
    "name": "getLocation",
    "group": "location",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "full",
            "description": "<p>if true return all info for city</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "location",
            "description": "<p>contains city information nfor location</p>"
          },
          {
            "group": "Success 200",
            "type": "[object]",
            "optional": false,
            "field": "city",
            "description": "<p>Contains all city information</p>"
          }
        ]
      }
    },
    "filename": "./index.js",
    "groupTitle": "location"
  }
] });
