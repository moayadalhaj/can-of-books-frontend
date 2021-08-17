import React, { Component } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

class BookFormModal extends Component {
  render() {
    return (
      <div>
        <Modal
          show={this.props.show}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Form style={{ padding: '20px' }} onSubmit={this.props.addBookForm} >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Add a Book!
              </Modal.Title>
            </Modal.Header>

            <Form.Group className="mb-3" controlId="bookName">
              <Form.Label>Book Name</Form.Label>
              <Form.Control type="text" placeholder="Enter book name" required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control type="text" placeholder="Enter description of the book" required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="status">
              <Form.Label>status</Form.Label>
              <Form.Control type="text" label="Status" required />
            </Form.Group>

            <Modal.Footer>
              <Button variant="primary" type="submit">
                Add Book
              </Button>
              <Button onClick={this.props.hideModalForm}>Close</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default BookFormModal;
