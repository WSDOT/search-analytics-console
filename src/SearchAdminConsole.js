import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import {
	BrowserRouter as Router,
	Route
} from 'react-router-dom'

import Analytics from './analytics/containers/Analytics'
import { signedIn } from './analytics/actions/actions'

import { Header } from './shared/components/Nav'

class SearchAdminConsole extends Component {

  componentDidMount(){

    window._this = this
    window.onSuccess = signedIn

    // Fetch JWT token for anayiltics api
    window.googlePlatformReadyCb = () => {
      console.info('gapi ready.');
      window.gapi.load('analytics', function () { 
        fetch(encodeURI(process.env.REACT_APP_GOOGLE_AUTH_HOST))
          .then(response => response.json())
          .then(json => {
              window.gapi.analytics.auth.authorize({
                'serverAuth': {
                  'access_token': json.access_token
                }
              })
              window._this.props.dispatch(window.onSuccess())
          })
      })
    }

    // Load in external google api library
    (function (d, s, id) {
      var js, gs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://apis.google.com/js/client:platform.js?onload=googlePlatformReadyCb';
      gs.parentNode.insertBefore(js, gs);
    }(document, 'script', 'google-platform')); 
  }

  render() {
    return(
      <Router>
        <div style={{paddingBottom: "275px"}}>
          <Header />
          {this.props.isSignedIn === true &&
          <Route exact path={process.env.REACT_APP_HOME} component={Analytics} />
          }
        </div>
      </Router>);
	}
}

SearchAdminConsole.propTypes = {
  isSignedIn: PropTypes.bool.isRequired
}

function mapStateToProps(state) {
  const isSignedIn = state.analytics.isSignedIn
  return {
    isSignedIn
  }
}

export default connect(mapStateToProps)(SearchAdminConsole)
