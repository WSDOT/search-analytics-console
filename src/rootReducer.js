import { combineReducers } from 'redux'

import { analytics } from './analytics/reducers/reducers'

// combines all reducers for use in configureStore.js
export default combineReducers({
  analytics
})

