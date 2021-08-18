import React, { Component } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import axios from "axios";
import { withAuth0 } from '@auth0/auth0-react';

class UpdateFormModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
      status: this.props.status,
      description: this.props.description,
    };
  }

  updateBook = (e) => {
    if (e.target.title.value) {
      this.props.hideModalForm(false);
    }

    if (this.props.auth0.isAuthenticated) {
      this.props.auth0.getIdTokenClaims()
        .then(result => {
          const jwt = result.__raw;
          let data = {
            title: this.state.title,
            status: this.state.status,
            description: this.state.description,
          }
          let config = {
            headers: { "Authorization": `Bearer ${jwt}` },
            method: 'put',
            baseURL: "http://localhost:8000",
            url: `/books/${this.props.updateBookId}`,
            data: data
          }
          axios(config).then(res => {
            console.log('Successfully updated');
          })
        })
        .catch((error) => console.log(error));
    }
  }

  getBookTitle = (e) => {
    this.setState({
      title: e.target.value
    })
  }

  getBookStatus = (e) => {
    this.setState({
      status: e.target.value
    })
  }

  getBookDescription = (e) => {
    this.setState({
      description: e.target.value
    })
  }

  render() {
    return (
      <div>
        <Modal
          show={this.props.show}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Form style={{ padding: '20px' }} onSubmit={e => this.updateBook(e)} >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Update A Book
              </Modal.Title>
            </Modal.Header>

            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Book Name</Form.Label>
              <Form.Control onChange={e => this.getBookTitle(e)} type="text" value={this.state.title} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control onChange={e => this.getBookDescription(e)} type="text" value={this.state.description} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="status">
              <Form.Label>status</Form.Label>
              <Form.Control onChange={e => this.getBookStatus(e)} type="text" value={this.state.status} />
            </Form.Group>

            <Modal.Footer>
              <Button variant="primary" type="submit">
                Update
              </Button>
              <Button onClick={this.props.hideModalForm}>Close</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default withAuth0(UpdateFormModal);
