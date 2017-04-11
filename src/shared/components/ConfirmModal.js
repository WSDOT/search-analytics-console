import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class ConfirmModal extends Component {
  constructor(props) {
    super(props);
    this.cancelClicked = this.cancelClicked.bind(this);
    this.confirmClicked = this.confirmClicked.bind(this);
  }

  cancelClicked() {
    this.props.onCancel();
  }

  confirmClicked() {
    this.props.onConfirm();
  }

  render() {
    return (
      <div>
        <Modal isOpen={this.props.isOpen}>
          <ModalHeader>{this.props.header}</ModalHeader>
          <ModalBody>
            {this.props.body}
          </ModalBody>
          <ModalFooter>
            <Button color={this.props.buttonStyle} onClick={this.confirmClicked}>{this.props.confirmTitle}</Button>{' '}
            <Button color="secondary" onClick={this.cancelClicked}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>);
  }
}
export default ConfirmModal;
