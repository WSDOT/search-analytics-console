import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Progress, ListGroupItem } from 'reactstrap'

class TopSearchListItem extends Component {
  render() {

    const searchURL = process.env.REACT_APP_SEARCH_URL + this.props.term
            
    return(
      <ListGroupItem>
        <Col>
          <Row>
            <Col className="text-left" sm="10">
              <a target="_blank" href={searchURL}>{this.props.term}</a>
            </Col>
            <Col className="text-right" sm="2">
              {this.props.count}
            </Col>
          </Row>
          <Row>
            <Col sm="12">
              <Progress color="success"  value={100 * this.props.percent} />
            </Col>
          </Row>
        </Col>
      </ListGroupItem>
    )
  }
}

TopSearchListItem.propTypes = {
  term: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  percent: PropTypes.number.isRequired
}

export default TopSearchListItem
