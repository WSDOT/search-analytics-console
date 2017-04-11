import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { ListGroupItemText, ListGroupItem, Badge, ListGroup, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class SearchTermListModal extends Component {
  constructor(props) {
    super(props);
    this.closeClicked = this.closeClicked.bind(this);
  }

  closeClicked() {
    this.props.onClose();
  }

  render() {
    const rows = []
    if (this.props.data !== undefined){
      this.props.data.terms.forEach((item) => {
        
        const searchURL = "https://www.wsdot.wa.gov/search/#q=" + item.term
        const baseURL = "http://wsdot.wa.gov"
        
        var startPages = item.startPages.map((pageItem, i) => {
          var startPageURL = baseURL
          if (pageItem.start !== "(entrance)") { 
            startPageURL = baseURL.concat(pageItem.start)
          }
          return (
              <a key={i} href={startPageURL} target="_blank">
                {pageItem.start}<br/>
              </a>)
        })

        rows.push(
          <ListGroupItem
            className="justify-content-between"
            key={item.term + item.startPage}> 
            <ListGroupItemText
              style={{width: "80%"}}> 
              <Badge pill>{item.count}</Badge>
              {' '}
              <a href={searchURL} target="_blank">
                {item.term}
              </a>           
            </ListGroupItemText>        
            <ListGroupItemText
              style={{width: "50%"}}> 
              Start Page{startPages.length > 1 ? 's' : ''}  <br/> 
              {startPages}
            </ListGroupItemText>

          </ListGroupItem>
          
        )
      })
    }
    return (
      <div>
        <Modal isOpen={this.props.isOpen}>
          <ModalHeader>
            {this.props.header} 
          </ModalHeader>
          <ModalBody style={{overflowY: "scroll", maxHeight: "400px"}}>
            <ListGroup>
              {rows}      
            </ListGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.closeClicked}>Close</Button>
          </ModalFooter>
        </Modal>
      </div>);
  }
}

SearchTermListModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  header: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired
}

export default SearchTermListModal;
