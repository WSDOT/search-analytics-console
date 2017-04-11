import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardTitle, Row, Col, ListGroup } from 'reactstrap'

import classnames from 'classnames'
import TopSearchListItem from './TopSearchListItem'

class TopSearches extends Component {

  constructor(props) {
    super(props)
    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1'
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  render() {
    
    if (this.props.firstTabData.length !== 0){
      const maxOne = this.props.firstTabData.reduce((prev, current) => (prev.count > current.count) ? prev : current).count
      var tabOneRows = [];
      this.props.firstTabData.forEach((dataItem) => {
        tabOneRows.push(
          <TopSearchListItem
            key={dataItem.term}
            term={dataItem.term}
            count={dataItem.count}
            percent={dataItem.count / maxOne}/>
        )
      })
    }

    if (this.props.secondTabData.length !== 0){
      const maxTwo = this.props.secondTabData.reduce((prev, current) => (prev.count > current.count) ? prev : current).count
      var tabTwoRows = [];
      this.props.secondTabData.forEach((dataItem) => {
        tabTwoRows.push(
          <TopSearchListItem
            key={dataItem.term}
            term={dataItem.term}
            count={dataItem.count}
            percent={dataItem.count / maxTwo}/>
        )
      })
    }

    return(
      <Card block style={{borderColor: '#FFFFFF', margin: 10}}>
        <CardTitle>Top Searches</CardTitle>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1'})}
              onClick={() => { this.toggle('1'); }}>
              {this.props.firstTabTitle}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}>
              {this.props.secondTabTitle}
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
                  <Col className="text-center" xs="12" sm="12" md="12" lg="12" >
                    <ListGroup>
                      {tabOneRows}
                    </ListGroup>
                  </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
                  <Col className="text-center" xs="12" sm="12" md="12" lg="12" >
                    <ListGroup>
                      {tabTwoRows}
                    </ListGroup>
                  </Col>
            </Row>
          </TabPane>
        </TabContent>
      </Card>
    )
  }
}

TopSearches.propTypes = {
  firstTabTitle: PropTypes.string.isRequired,
  secondTabTitle: PropTypes.string.isRequired,
  firstTabData: PropTypes.array.isRequired,
  secondTabData: PropTypes.array.isRequired
}

export default TopSearches
