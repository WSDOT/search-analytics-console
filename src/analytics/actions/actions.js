export const SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS'


/**
 *  Redux actions file
 *
 *  Most actions call the Google analytics api for data.
 *  This is considered a side effect of the action and is
 *  handled with a redux thunk.
 *
 *  Please note: when adding new dimensinos & metrics to the reports,
 *  the order matters as the data is returned in an array whoes order is
 *  based on the json object used in the batch get.
 */

export function signedIn() {
  return {
    type: SIGN_IN_SUCCESS
  }
}

export const NEW_DAY_REPORT_DATE = 'NEW_DAY_REPORT_DATE'

export function setDayReportDate(date){    
  return {
    type: NEW_DAY_REPORT_DATE,
    newDate: date
  }
}

export const FETCH_DAY_REPORT_SUCCESS = 'FETCH_DAY_REPORT_SUCCESS'
export const FETCH_DAY_REPORT_REQUEST = 'FETCH_DAY_REPORT_REQUEST'

function receiveDayReport(report) { 
  return {
    type: FETCH_DAY_REPORT_SUCCESS,
    report: report
  }
}
function requestDayReport() {
  return {
    type: FETCH_DAY_REPORT_REQUEST
  }
}


export function getDayReport(date) {
  return dispatch => {
    dispatch(requestDayReport())
    return getAllDayReports(dispatch, date, "0") 
  }
}

function getAllDayReports(dispatch, date, pageToken, reports = []) {

  if (pageToken === undefined){
    pageToken = 0
  }

  return window.gapi.client.request({
    path: '/v4/reports:batchGet',
    root: 'https://analyticsreporting.googleapis.com/',
    method: 'POST',
    body: {
      "reportRequests": [
        {
          "viewId": "39054150",
          "dateRanges": [
            {
              "startDate": date.format('YYYY-MM-DD'),
              "endDate": date.format('YYYY-MM-DD')
            }
          ],
          "dimensions": [
            {
              "name": "ga:searchKeyword"
            },
            {
              "name": "ga:nthHour"
            },
            {
              "name": "ga:hour"
            },
            {
              "name": "ga:searchStartPage"
            },
            {
              "name": "ga:searchAfterDestinationPage"
            } 
          ], 
          "metrics": [
            {
             "expression": "ga:searchUniques"
            }
          ],
          "orderBys": [
            {
              "sortOrder": "ASCENDING",
              "fieldName": "ga:nthHour"
            }
          ],
          "pageSize": "10000",
          "pageToken": pageToken
        }
      ]
    }
  }).then(json => { 
    console.error.bind(console)
    // Check if we still have more data to fetch, or create the report to return
    var combinedJson = reports.concat(json.result.reports[0].data.rows)
    if (json.result.reports[0].nextPageToken) {
      getAllDayReports(dispatch, date, json.result.reports[0].nextPageToken, combinedJson)
    } else {
      
      const report = createReport(combinedJson)

      // check if report is using sampled data.
      // Response body will have field samplesReadCounts
      // https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet#response-body
      var isSampled = false  
      if (json.result.reports[0].data.samplesReadCounts){
        isSampled = true
      }

      var result = {
        report,
        isSampled
      }
      dispatch(receiveDayReport(result))   
    }
  })
}


export const NEW_MULTI_DAY_REPORT_DATES = 'NEW_MULTI_DAY_REPORT_DATES'

export function setMultiDayReportDates(startDate, endDate){    
  
  return {
    type: NEW_MULTI_DAY_REPORT_DATES,
    startDate: startDate,
    endDate: endDate
  }
}

export const FETCH_MULTI_DAY_REPORT_SUCCESS = 'FETCH_MULTI_DAY_REPORT_SUCCESS'
export const FETCH_MULTI_DAY_REPORT_REQUEST = 'FETCH_MULTI_DAY_REPORT_REQUEST'

function receiveMultiDayReport(result) { 
  return {
    type: FETCH_MULTI_DAY_REPORT_SUCCESS,
    data: result
  }
}
function requestMultiDayReport() {
  return {
    type: FETCH_MULTI_DAY_REPORT_REQUEST
  }
}

export function getMultiDayReport(startDate, endDate) {
  return dispatch => {
    dispatch(requestMultiDayReport())
    return getAllMultiDayReports(startDate, endDate, dispatch, "0") 
  }
}

function getAllMultiDayReports(startDate, endDate, dispatch, pageToken, reports = []) {

  if (pageToken === undefined){
    pageToken = 0
  }

  return window.gapi.client.request({
    path: '/v4/reports:batchGet',
    root: 'https://analyticsreporting.googleapis.com/',
    method: 'POST',
    body: {
      "reportRequests": [
        {
          "viewId": "39054150",
          "dateRanges": [
            {
              "startDate": startDate.format('YYYY-MM-DD'),
              "endDate": endDate.format('YYYY-MM-DD')
            }
          ],
          "dimensions": [
            {
              "name": "ga:searchKeyword"
            },
            {
              "name": "ga:nthDay"
            },
            {
              "name": "ga:date"
            },
            {
              "name": "ga:searchStartPage"
            },
            {
              "name": "ga:searchAfterDestinationPage"
            }
          ],
          "metrics": [
            {
              "expression": "ga:searchUniques"
            }
          ],
          "orderBys": [
            {
              "sortOrder": "ASCENDING",
              "fieldName": "ga:nthDay"
            }
          ],
          "pageSize": "10000",
          "includeEmptyRows": "false",
          "pageToken": pageToken,
        }
      ]
    }
  }).then(json => { 
    console.error.bind(console)
    // Check if we still have more data to fetch, or create the report to return
    var combinedJson = reports.concat(json.result.reports[0].data.rows)
    
    if (json.result.reports[0].nextPageToken) {
      getAllMultiDayReports(startDate, endDate, dispatch, json.result.reports[0].nextPageToken, combinedJson)
    } else {
        
      const report = createReport(combinedJson)
        
        // check if report is using sampled data.
      // Response body will have field samplesReadCounts
      // https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet#response-body
      var isSampled = false  
      if (json.result.reports[0].data.samplesReadCounts){
        isSampled = true
      }

      var result = {
        report,
        isSampled
      }

      dispatch(receiveMultiDayReport(result))   
    }
  })
}

// Sort Google analytics result row into chart data.
// An array of weeks and search terms for that week.
function createReport(json) { 

  var report = json.reduce(function(results, row) {
    var timeIndex = results.findIndex(item => item.time === row.dimensions[2]);

    // check if this is a new time interval
    if (timeIndex === -1){
      results.push({
        timeInterval: row.dimensions[1],
        time: row.dimensions[2],
        terms: [{
          term: row.dimensions[0], 
          count: parseInt(row.metrics[0].values[0], 10),
          startPages: [{
            start: row.dimensions[3],
            count: 1
          }],
          destPages: [{
            dest: row.dimensions[4],
            count: 1
          }]
        }]
      })
    // We've already started collecting data for this date, update it.
    } else {
      var termIndex = results[timeIndex].terms.findIndex(item =>
          item.term === row.dimensions[0])

      // check if this term has been added for this day
      if (termIndex === -1){
        results[timeIndex].terms.push({
          term: row.dimensions[0], 
          count: parseInt(row.metrics[0].values[0], 10),
          startPages: [{
            start: row.dimensions[3],
            count: 1
          }],
          destPages: [{
            dest: row.dimensions[4],
            count: 1
          }]
        })
      // term had already been added, update count, startPages, & destinations
      } else {

        //update count
        results[timeIndex].terms[termIndex].count += parseInt(row.metrics[0].values[0], 10)
        
        // update start pages
        var startPageIndex = results[timeIndex].terms[termIndex].startPages.findIndex(item =>
          item.start === row.dimensions[3])
          
        // new start page
        if (startPageIndex === -1){
          results[timeIndex].terms[termIndex].startPages.push({
            start: row.dimensions[3],
            count: 1
          })
        // start page already added, update count
        }else{
          results[timeIndex].terms[termIndex].startPages[startPageIndex].count += 1
        }

        // update dest pages
        var destPageIndex = results[timeIndex].terms[termIndex].destPages.findIndex(item =>
          item.dest === row.dimensions[4])

        // new dest page
        if (destPageIndex === -1){
          results[timeIndex].terms[termIndex].destPages.push({
            dest: row.dimensions[4],
            count: 1
          })
        // dest page already added, update count
        }else{
          results[timeIndex].terms[termIndex].destPages[destPageIndex].count += 1
        }
      }
    }
    return results
  }, []);

  report.sort(function(a, b) {
    return (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0)
  })

  // sort terms by serach count
  report.forEach( function (item) { 
    item.terms.sort(function(a,b) {
      return (a.count < b.count) ? 1 : ((b.count < a.count) ? -1 : 0)
    })
  })

  return report
}


export const FETCH_TOP_SEVEN_DAY_REPORT_SUCCESS = 'FETCH_TOP_SEVEN_DAY_REPORT_SUCCESS'
export const FETCH_TOP_SEVEN_DAY_REPORT_REQUEST = 'FETCH_TOP_SEVEN_DAY_REPORT_REQUEST'

function receiveTopSevenDayReport(json, report) {     
  return {
    type: FETCH_TOP_SEVEN_DAY_REPORT_SUCCESS,
    data: json
  }
}

function requestTopSevenDayReport() {
  return {
    type: FETCH_TOP_SEVEN_DAY_REPORT_REQUEST
  }
}

export function getTopSevenDayReport() {
  return dispatch => {
    dispatch(requestTopSevenDayReport())
    return window.gapi.client.request({
      path: '/v4/reports:batchGet',
      root: 'https://analyticsreporting.googleapis.com/',
      method: 'POST',
      body: {
        "reportRequests": [
          {
            "viewId": "39054150",
            "dateRanges": [
              {
                "startDate": "7daysAgo",
                "endDate": "today"
              }
            ],
            "dimensions": [
              {
                "name": "ga:searchKeyword"
              }
            ],
            "metrics": [
              {
                "expression": "ga:searchUniques"
              }
            ],
            "includeEmptyRows": true,
            "orderBys": [
              {
                "sortOrder": "DESCENDING",
                "fieldName": "ga:searchUniques"
              }
            ],
            "pageSize": "10"
          }
        ]
      }
    }).then(json => { 
      console.error.bind(console)        
      var report = json.result.reports[0].data.rows.reduce(function(results, row) {
        results.push({
          term: row.dimensions[0],
          count: parseInt(row.metrics[0].values[0], 10)
        })
        return results
      }, [])
        
      dispatch(receiveTopSevenDayReport(report))   
    })
  }
}

export const FETCH_TOP_THIRTY_DAY_REPORT_SUCCESS = 'FETCH_TOP_THIRTY_DAY_REPORT_SUCCESS'
export const FETCH_TOP_THIRTY_DAY_REPORT_REQUEST = 'FETCH_TOP_THIRTH_DAY_REPORT_REQUEST'

function receiveTopThirtyDayReport(json, report) {     
  return {
    type: FETCH_TOP_THIRTY_DAY_REPORT_SUCCESS,
    data: json
  }
}

function requestTopThirtyDayReport() {
  return {
    type: FETCH_TOP_THIRTY_DAY_REPORT_REQUEST
  }
}

export function getTopThirtyDayReport() {
  return dispatch => {
    dispatch(requestTopThirtyDayReport())
    return window.gapi.client.request({
      path: '/v4/reports:batchGet',
      root: 'https://analyticsreporting.googleapis.com/',
      method: 'POST',
      body: {
        "reportRequests": [
          {
            "viewId": "39054150",
            "dateRanges": [
              {
                "startDate": "30daysAgo",
                "endDate": "today"
              }
            ],
            "dimensions": [
              {
                "name": "ga:searchKeyword"
              }
            ],
            "metrics": [
              {
                "expression": "ga:searchUniques"
              }
            ],
            "includeEmptyRows": true,
            "orderBys": [
              {
                "sortOrder": "DESCENDING",
                "fieldName": "ga:searchUniques"
              }
            ],
            "pageSize": "10"
          }
        ]
      }
    }).then(json => { 
      console.error.bind(console)        
      var report = json.result.reports[0].data.rows.reduce(function(results, row) {
        results.push({
          term: row.dimensions[0],
          count: parseInt(row.metrics[0].values[0], 10)
        })
        return results
      }, [])
      dispatch(receiveTopThirtyDayReport(report))   
    })
  }
}
