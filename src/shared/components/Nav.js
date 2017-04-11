import React, { Component } from 'react';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

import {
	Route,
	Link
} from 'react-router-dom'

/**
 * Custom LinkNav Component that sets the tab as active if it matches the current URL.
 * Uses Route.children to render.
 */
export class MyLinkNav extends Component {
  render() {
    return(
        <Route path={this.props.to} exact={this.props.activeOnlyWhenExact} children={({ match }) => (
          <NavLink tag={Link} to={this.props.to} active={match ? true : false}>{this.props.title}</NavLink>
        )}/>
    );
  }
}

export class Header extends Component {

  render() {
    return( 
          <Navbar color="faded" light toggleable={true}>
            <NavbarBrand href="/">Search Analytics</NavbarBrand>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink 
                  href={process.env.REACT_APP_ANALYTICS_URL}>
                  Google Analytics
                </NavLink>
              </NavItem>
              </Nav>
          </Navbar>
        );}
}
