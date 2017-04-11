import {
  SIGN_IN_SUCCESS,
  
  NEW_DAY_REPORT_DATE,
  FETCH_DAY_REPORT_SUCCESS,
  FETCH_DAY_REPORT_REQUEST,

  NEW_MULTI_DAY_REPORT_DATES,
  FETCH_MULTI_DAY_REPORT_SUCCESS,
  FETCH_MULTI_DAY_REPORT_REQUEST,

  FETCH_TOP_SEVEN_DAY_REPORT_SUCCESS,
  FETCH_TOP_SEVEN_DAY_REPORT_REQUEST,

  FETCH_TOP_THIRTY_DAY_REPORT_SUCCESS,
  FETCH_TOP_THIRTY_DAY_REPORT_REQUEST

} from '../actions/actions'

import moment from 'moment'

const initState = {
  isSignedIn: false,
  
  isFetchingDayReport: false,
  dayReportDate: moment().subtract(1, 'days'),
  dayReportData: {report: [], isSampled: false},
  
  isFetchingMultiDayReport: false,
  multiDayReportData: {report: [], isSampled: false},
  multiDayReportStartDate: moment().subtract(7, 'days'),
  multiDayReportEndDate: moment().subtract(1, 'days'),

  isFetchingTopSevenDayReport: false,
  topSevenDayReportData: [],

  isFetchingTopThirtyDayReport: false,
  topThirtyDayReportData: []
}

export function analytics(state = initState, action) {
  switch (action.type) {
    case SIGN_IN_SUCCESS:
      return Object.assign({}, state, {
        isSignedIn: true
      })
    case NEW_DAY_REPORT_DATE:
      return Object.assign({}, state, {
        dayReportDate: action.newDate
      })
    case FETCH_DAY_REPORT_SUCCESS:
      return Object.assign({}, state, {
        isFetchingDayReport: false,
        dayReportData: action.report
      })
    case FETCH_DAY_REPORT_REQUEST:
      return Object.assign({}, state, {
        isFetchingDayReport: true
      })
    case NEW_MULTI_DAY_REPORT_DATES:
      return Object.assign({}, state, {
        multiDayReportStartDate: action.startDate,
        multiDayReportEndDate: action.endDate
      })
    case FETCH_MULTI_DAY_REPORT_SUCCESS:
      return Object.assign({}, state, {
        isFetchingMultiDayReport: false,
        multiDayReportData: action.data
      })
    case FETCH_MULTI_DAY_REPORT_REQUEST:
      return Object.assign({}, state, {
        isFetchingMultiDayReport: true
      })
    case FETCH_TOP_SEVEN_DAY_REPORT_SUCCESS:
      return Object.assign({}, state, {
        isFetchingTopSevenDayReport: false,
        topSevenDayReportData: action.data
      })
    case FETCH_TOP_SEVEN_DAY_REPORT_REQUEST:
      return Object.assign({}, state, {
        isFetchingTopSevenDayReport: true
      })
    case FETCH_TOP_THIRTY_DAY_REPORT_SUCCESS:
      return Object.assign({}, state, {
        isFetchingTopThirtyDayReport: false,
        topThirtyDayReportData: action.data
      })
    case FETCH_TOP_THIRTY_DAY_REPORT_REQUEST:
      return Object.assign({}, state, {
        isFetchingTopThirtyDayReport: true
      })
    default:
      return state
  }
}

